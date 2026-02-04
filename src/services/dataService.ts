import siteData from '../data/site.json';
import sourcesIndex from '../data/sources/index.json';
import exhibitionsIndex from '../data/exhibitions/index.json';
import exhibitionSovietCentralAsia from '../data/exhibitions/soviet-central-asia.json';

// Import individual source files
import fleaSource from '../data/sources/flea.json';
import eliasAshmoleSource from '../data/sources/elias-ashmole.json';
import calendricalSource from '../data/sources/calendrical-complications.json';
import cameraObscuraSource from '../data/sources/camera-obscura.json';
import xylographySource from '../data/sources/xylography.json';
import johnTradescantSource from '../data/sources/john-tradescant.json';
import picturePostcardsSource from '../data/sources/picture-postcards.json';
import rhinocerosHornSource from '../data/sources/rhinoceros-horn-cup.json';
import durerErasmusSource from '../data/sources/albrecht-durer-erasmus.json';
import buddhaSatueSource from '../data/sources/statue-buddha.json';
import astrolabeSource from '../data/sources/astrolabe.json';

// Import exhibition objects
import gulYakaObject from '../data/exhibitions/soviet-central-asia/gul-yaka.json';
import pickledCucumbersObject from '../data/exhibitions/soviet-central-asia/pickled-cucumbers.json';
import quranTranslationObject from '../data/exhibitions/soviet-central-asia/quran-translation.json';
import pakhtakhorObject from '../data/exhibitions/soviet-central-asia/pakhtakhor-monument.json';

import type { Source, SiteData, Paper, Exhibition, ExhibitionObject, ExhibitionSummary } from '../types';

const STORAGE_KEY = 'cabinet_sources_v2'; // Version to invalidate old cache

// Map of source IDs to source data
const sourcesMap: Record<string, Source> = {
  'flea': fleaSource as Source,
  'elias-ashmole': eliasAshmoleSource as Source,
  'calendrical-complications': calendricalSource as Source,
  'camera-obscura': cameraObscuraSource as Source,
  'xylography': xylographySource as Source,
  'john-tradescant-elder': johnTradescantSource as Source,
  'picture-postcards': picturePostcardsSource as Source,
  'rhinoceros-horn-cup': rhinocerosHornSource as Source,
  'albrecht-durer-erasmus': durerErasmusSource as Source,
  'statue-buddha': buddhaSatueSource as Source,
  'astrolabe-demo': astrolabeSource as Source,
};

// Map of exhibition object IDs to data
const exhibitionObjectsMap: Record<string, ExhibitionObject> = {
  'gul-yaka': gulYakaObject as ExhibitionObject,
  'pickled-cucumbers': pickledCucumbersObject as ExhibitionObject,
  'quran-translation': quranTranslationObject as ExhibitionObject,
  'pakhtakhor-monument': pakhtakhorObject as ExhibitionObject,
};

// Always return fresh data from JSON files (localStorage disabled for development)
function initializeSources(): Source[] {
  // Clear old cache
  localStorage.removeItem('cabinet_sources');
  localStorage.removeItem(STORAGE_KEY);
  // Return fresh data directly from imports
  return Object.values(sourcesMap);
}

export function getSiteData(): SiteData {
  return siteData as SiteData;
}

export function getAllSources(): Source[] {
  return initializeSources();
}

export function getSourceBySlug(slug: string): Source | undefined {
  const sources = getAllSources();
  return sources.find(s => s.slug === slug);
}

export function getSourceTypes(): string[] {
  return sourcesIndex.sourceTypes;
}

export function getTags(): string[] {
  return sourcesIndex.tags;
}

export function getPapers(): Paper[] {
  return sourcesIndex.papers as Paper[];
}

export function searchSources(
  query: string,
  sourceType?: string,
  tag?: string
): Source[] {
  let sources = getAllSources();

  if (query) {
    const lowerQuery = query.toLowerCase();
    sources = sources.filter(
      s =>
        s.title.toLowerCase().includes(lowerQuery) ||
        s.description.toLowerCase().includes(lowerQuery) ||
        s.tags.some(t => t.toLowerCase().includes(lowerQuery)) ||
        s.paper.toLowerCase().includes(lowerQuery)
    );
  }

  if (sourceType && sourceType !== 'All') {
    sources = sources.filter(s => s.sourceType === sourceType);
  }

  if (tag) {
    sources = sources.filter(s => s.tags.includes(tag));
  }

  return sources;
}

export function getSourcesByPaper(paperTitle: string): Source[] {
  const sources = getAllSources();
  return sources.filter(s => s.paper === paperTitle);
}

export function getSourcesByUnit(unitName: string): Source[] {
  const sources = getAllSources();
  return sources.filter(s => s.unit === unitName);
}

// Exhibition functions
export function getAllExhibitions(): ExhibitionSummary[] {
  return exhibitionsIndex.exhibitions as ExhibitionSummary[];
}

export function getExhibitionBySlug(slug: string): Exhibition | undefined {
  if (slug === 'soviet-central-asia-100-objects') {
    return exhibitionSovietCentralAsia as Exhibition;
  }
  return undefined;
}

export function getExhibitionObjects(exhibitionId: string): ExhibitionObject[] {
  return Object.values(exhibitionObjectsMap).filter(
    obj => obj.exhibitionId === exhibitionId
  );
}

export function getExhibitionObjectBySlug(slug: string): ExhibitionObject | undefined {
  return Object.values(exhibitionObjectsMap).find(obj => obj.slug === slug);
}

export function getExhibitionObjectsByPart(exhibitionId: string, partId: string): ExhibitionObject[] {
  const exhibition = exhibitionId === 'soviet-central-asia'
    ? exhibitionSovietCentralAsia as Exhibition
    : undefined;

  if (!exhibition) return [];

  const part = exhibition.parts.find(p => p.id === partId);
  if (!part) return [];

  return part.objectIds
    .map(id => exhibitionObjectsMap[id])
    .filter(Boolean);
}

// Admin functions for future use
export function addSource(source: Source): void {
  const sources = getAllSources();
  sources.push(source);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sources));
}

export function updateSource(slug: string, updates: Partial<Source>): void {
  const sources = getAllSources();
  const index = sources.findIndex(s => s.slug === slug);
  if (index !== -1) {
    sources[index] = { ...sources[index], ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sources));
  }
}

export function resetData(): void {
  const sources = Object.values(sourcesMap);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sources));
}
