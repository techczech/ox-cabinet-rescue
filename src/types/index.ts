export interface ImageData {
  url: string;
  caption?: string | null;
  credit?: string;
}

export interface Model3D {
  url: string;
  caption: string;
  credit: string;
  poster?: string;
}

export interface Source {
  id: string;
  slug: string;
  title: string;
  description: string;
  sourceType: string;
  tags: string[];
  primarySource: string;
  images: ImageData[];
  model3d?: Model3D;
  unit: string;
  paper: string;
  date: string;
  medium?: string;
  dimensions?: string;
  accessionId?: string;
}

export interface Paper {
  id: string;
  title: string;
  units: string[];
}

export interface TeamMember {
  name: string;
  role: string;
  affiliation: string;
}

export interface SiteData {
  name: string;
  tagline: string;
  description: string;
  team: {
    current: TeamMember[];
    past: string[];
  };
  partners: string[];
  navigation: Array<{ label: string; path: string }>;
}

export interface SourcesData {
  sources: Source[];
  sourceTypes: string[];
  tags: string[];
  papers: Paper[];
}

// Exhibition types
export interface ExhibitionAuthor {
  name: string;
  bio: string;
}

export interface ExhibitionObject {
  id: string;
  slug: string;
  title: string;
  exhibitionId: string;
  country: string;
  objectType: string;
  tags: string[];
  description: string;
  commentary: string;
  author: ExhibitionAuthor;
  provenance: string;
  images: ImageData[];
  date: string;
  references: string[];
}

export interface ExhibitionOrganizer {
  name: string;
  affiliation: string;
}

export interface ExhibitionPart {
  id: string;
  title: string;
  language: string;
  objectIds: string[];
}

export interface Exhibition {
  id: string;
  slug: string;
  title: string;
  description: string;
  descriptionRussian?: string;
  status: 'ongoing' | 'completed';
  targetCount: number;
  currentCount: number;
  languages: string[];
  parts: ExhibitionPart[];
  organizers: ExhibitionOrganizer[];
  editorialBoard: ExhibitionOrganizer[];
  support: {
    translators: Array<{ name: string; role: string }>;
    dataInput: string[];
    sponsors: string[];
  };
}

export interface ExhibitionSummary {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  status: string;
  objectCount: number;
}
