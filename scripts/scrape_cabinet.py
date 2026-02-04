import json
import re
from pathlib import Path
from typing import Any, Dict, List, Optional

import requests
from bs4 import BeautifulSoup

DATA_DIRS = [
    Path("src/data/sources"),
    Path("src/data/exhibitions"),
]


def _normalize_text(text: str) -> str:
    text = re.sub(r"\s+", " ", text).strip()
    return text


def _extract_body_html(field, base_url: str, soup: BeautifulSoup) -> Optional[str]:
    if not field:
        return None
    item = field.select_one(".field-item") or field
    for tag in item.find_all(["script", "style"]):
        tag.decompose()
    for a in item.find_all("a"):
        href = a.get("href")
        if href:
            a["href"] = _absolute_url(href, base_url)
    for img in item.find_all("img"):
        src = img.get("src") or img.get("data-src")
        if src:
            img["src"] = _normalize_image_url(_absolute_url(src, base_url))
    for span in list(item.find_all("span")):
        style = (span.get("style") or "").lower()
        is_italic = "italic" in style
        is_bold = "font-weight:700" in style or "font-weight: 700" in style or "font-weight:bold" in style or "font-weight: bold" in style
        if not is_italic and not is_bold:
            span.unwrap()
            continue
        new_tag = None
        if is_italic and is_bold:
            strong = soup.new_tag("strong")
            em = soup.new_tag("em")
            for child in list(span.contents):
                em.append(child.extract())
            strong.append(em)
            new_tag = strong
        elif is_italic:
            em = soup.new_tag("em")
            for child in list(span.contents):
                em.append(child.extract())
            new_tag = em
        elif is_bold:
            strong = soup.new_tag("strong")
            for child in list(span.contents):
                strong.append(child.extract())
            new_tag = strong
        if new_tag is not None:
            span.replace_with(new_tag)
    for tag in item.find_all(True):
        if tag.has_attr("style"):
            del tag["style"]
    html = "".join(str(child) for child in item.contents).strip()
    return html or None


def _absolute_url(url: str, base: str) -> str:
    if url.startswith("http://") or url.startswith("https://"):
        return url
    if url.startswith("//"):
        return "https:" + url
    if url.startswith("/"):
        return base.rstrip("/") + url
    return base.rstrip("/") + "/" + url


def _normalize_image_url(url: str) -> str:
    url = re.sub(r"/sites/default/files/styles/[^/]+/public/", "/sites/default/files/", url)
    url = url.split("?", 1)[0]
    return url


def _choose_image_url(img) -> Optional[str]:
    if img.get("data-src"):
        return img.get("data-src")
    if img.get("data-srcset"):
        return _choose_from_srcset(img.get("data-srcset"))
    if img.get("srcset"):
        return _choose_from_srcset(img.get("srcset"))
    return img.get("src")


def _choose_from_srcset(srcset: str) -> Optional[str]:
    candidates = []
    for part in srcset.split(","):
        bits = part.strip().split()
        if not bits:
            continue
        url = bits[0]
        size = bits[1] if len(bits) > 1 else "0w"
        width = 0
        if size.endswith("w"):
            try:
                width = int(size[:-1])
            except ValueError:
                width = 0
        candidates.append((width, url))
    if not candidates:
        return None
    candidates.sort(key=lambda x: x[0], reverse=True)
    return candidates[0][1]


def _extract_media_ids(html: str) -> List[int]:
    match = re.search(r'source_media"?\s*:\s*\[([^\]]*)\]', html)
    if not match:
        return []
    raw = match.group(1)
    ids = []
    for part in raw.split(","):
        part = part.strip()
        if not part:
            continue
        try:
            ids.append(int(part))
        except ValueError:
            continue
    return ids


def _extract_media_images(media_id: int, base_url: str) -> List[str]:
    url = f"{base_url.rstrip('/')}/node/{media_id}"
    resp = requests.get(url, timeout=30)
    if resp.status_code != 200:
        return []
    matches = re.findall(r"/sites/default/files/[^\"']+\.(?:jpg|jpeg|png|gif)", resp.text, flags=re.I)
    return [_normalize_image_url(_absolute_url(m, base_url)) for m in matches]


def scrape_cabinet(url: str) -> Dict[str, Any]:
    resp = requests.get(url, timeout=30)
    resp.raise_for_status()
    soup = BeautifulSoup(resp.text, "html.parser")
    html = resp.text

    # Title
    title = None
    h1 = soup.find("h1")
    if h1 and h1.get_text(strip=True):
        title = h1.get_text(strip=True)
    elif soup.title and soup.title.get_text(strip=True):
        title = soup.title.get_text(strip=True).replace("| cabinet", "").strip()

    # Tags
    tags = []
    for item in soup.select(".field-name-field-source-tags .field-item"):
        tag_text = item.get_text(" ", strip=True)
        if tag_text:
            tags.append(tag_text.lower())
    tags = list(dict.fromkeys(tags))

    # Body / Commentary
    body_field = soup.select_one(".field-name-body")
    body_html = _extract_body_html(body_field, "https://www.cabinet.ox.ac.uk", soup)
    body_text = None
    if body_html:
        body_text = BeautifulSoup(body_html, "html.parser").get_text(" ", strip=True)

    # All fields
    fields: List[Dict[str, Any]] = []
    for field in soup.select(".field"):
        class_names = field.get("class", [])
        field_name = None
        for cls in class_names:
            if cls.startswith("field-name-"):
                field_name = cls
                break
        label_node = field.select_one(".field-label")
        label = label_node.get_text(" ", strip=True) if label_node else None
        if label and label.endswith(":"):
            label = label[:-1].strip()
        items = [
            _normalize_text(it.get_text(" ", strip=True))
            for it in field.select(".field-item")
            if it.get_text(strip=True)
        ]
        if items:
            fields.append(
                {
                    "name": field_name,
                    "label": label,
                    "values": items,
                }
            )

    # Images (treat thumbnails as images)
    images = []
    seen = set()
    for img in soup.select("img"):
        src = _choose_image_url(img)
        if not src:
            continue
        abs_src = _absolute_url(src, "https://www.cabinet.ox.ac.uk")
        if "/themes/" in abs_src or "logo" in abs_src:
            continue
        if "/sites/default/files/" not in abs_src and "/files/" not in abs_src:
            continue
        abs_src = _normalize_image_url(abs_src)
        if abs_src in seen:
            continue
        seen.add(abs_src)
        alt = (img.get("alt") or "").strip()
        caption = _normalize_text(alt) if alt else None
        images.append(
            {
                "url": abs_src,
                "caption": caption,
            }
        )

    # Fallback: pull media nodes referenced in Drupal settings
    media_ids = _extract_media_ids(html)
    if media_ids:
        for media_id in media_ids:
            for media_url in _extract_media_images(media_id, "https://www.cabinet.ox.ac.uk"):
                if media_url in seen:
                    continue
                seen.add(media_url)
                images.append(
                    {
                        "url": media_url,
                        "caption": None,
                    }
                )

    # Backfill: follow related-source thumbnails when no images are present
    if not images:
        related_links = []
        for a in soup.select("a"):
            img = a.find("img")
            href = a.get("href")
            if not img or not href:
                continue
            img_src = img.get("src") or ""
            if "/sites/default/files/styles/thumbnail__" not in img_src:
                continue
            related_links.append(
                {
                    "href": _absolute_url(href, "https://www.cabinet.ox.ac.uk"),
                    "caption": _normalize_text(img.get("alt") or "") or None,
                }
            )
        # Deduplicate while preserving order
        seen_links = set()
        filtered_links = []
        for item in related_links:
            if item["href"] in seen_links:
                continue
            seen_links.add(item["href"])
            filtered_links.append(item)

        for item in filtered_links[:5]:
            rel_images = _extract_images_from_page(item["href"])
            for img_url in rel_images:
                if img_url in seen:
                    continue
                seen.add(img_url)
                images.append(
                    {
                        "url": img_url,
                        "caption": item["caption"],
                    }
                )
            if images:
                break

    return {
        "title": title,
        "tags": tags,
        "body": body_text,
        "body_html": body_html,
        "fields": fields,
        "images": images,
    }


def _extract_images_from_page(url: str) -> List[str]:
    try:
        resp = requests.get(url, timeout=30)
    except Exception:
        return []
    if resp.status_code != 200:
        return []
    soup = BeautifulSoup(resp.text, "html.parser")
    html = resp.text
    found = []
    seen = set()
    for img in soup.select("img"):
        src = _choose_image_url(img)
        if not src:
            continue
        abs_src = _absolute_url(src, "https://www.cabinet.ox.ac.uk")
        if "/themes/" in abs_src or "logo" in abs_src:
            continue
        if "/sites/default/files/" not in abs_src and "/files/" not in abs_src:
            continue
        abs_src = _normalize_image_url(abs_src)
        if abs_src in seen:
            continue
        seen.add(abs_src)
        found.append(abs_src)
    media_ids = _extract_media_ids(html)
    if media_ids:
        for media_id in media_ids:
            for media_url in _extract_media_images(media_id, "https://www.cabinet.ox.ac.uk"):
                if media_url in seen:
                    continue
                seen.add(media_url)
                found.append(media_url)
    return found


def update_json(path: Path) -> bool:
    data = json.loads(path.read_text(encoding="utf-8"))
    url = data.get("cabinetUrl")
    if not url:
        return False
    scraped = scrape_cabinet(url)

    if scraped.get("title"):
        data["title"] = scraped["title"]
    if scraped.get("tags"):
        data["tags"] = scraped["tags"]
    if scraped.get("body_html"):
        data["description"] = scraped["body_html"]
        if "commentary" in data:
            data["commentary"] = scraped["body_html"]
    elif scraped.get("body"):
        data["description"] = scraped["body"]
        if "commentary" in data:
            data["commentary"] = scraped["body"]
    data["images"] = scraped.get("images", [])
    data["scrapedFromCabinet"] = True
    data["imageSource"] = "cabinet"
    if "isMockData" in data:
        data["isMockData"] = False
    data["cabinetFields"] = scraped.get("fields", [])

    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return True


def main() -> None:
    json_paths = []
    for base in DATA_DIRS:
        if not base.exists():
            continue
        json_paths.extend(base.rglob("*.json"))

    updated = 0
    for path in sorted(json_paths):
        try:
            if update_json(path):
                updated += 1
        except Exception as exc:
            print(f"[WARN] {path}: {exc}")
    print(f"Updated {updated} files")


if __name__ == "__main__":
    main()
