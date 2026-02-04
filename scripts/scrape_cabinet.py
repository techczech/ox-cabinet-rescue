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
    # Preserve paragraph breaks while normalizing spaces.
    text = re.sub(r"\s+", " ", text).strip()
    return text


def _extract_body(field) -> Optional[str]:
    if not field:
        return None
    paragraphs = [p.get_text(" ", strip=True) for p in field.select("p") if p.get_text(strip=True)]
    if paragraphs:
        return "\n\n".join(_normalize_text(p) for p in paragraphs if p)
    text = field.get_text(" ", strip=True)
    return _normalize_text(text) if text else None


def _absolute_url(url: str, base: str) -> str:
    if url.startswith("http://") or url.startswith("https://"):
        return url
    if url.startswith("//"):
        return "https:" + url
    if url.startswith("/"):
        return base.rstrip("/") + url
    return base.rstrip("/") + "/" + url


def scrape_cabinet(url: str) -> Dict[str, Any]:
    resp = requests.get(url, timeout=30)
    resp.raise_for_status()
    soup = BeautifulSoup(resp.text, "html.parser")

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
    body_text = _extract_body(body_field)

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
        src = img.get("src")
        if not src:
            continue
        abs_src = _absolute_url(src, "https://www.cabinet.ox.ac.uk")
        if "/themes/" in abs_src or "logo" in abs_src:
            continue
        if "/sites/default/files/" not in abs_src and "/files/" not in abs_src:
            continue
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

    return {
        "title": title,
        "tags": tags,
        "body": body_text,
        "fields": fields,
        "images": images,
    }


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
    if scraped.get("body"):
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
