import { 
  MediaType, 
  MediaStatus, 
  MediaFormat, 
  CoverImage, 
  Title, 
  FuzzyDate, 
  Tag, 
  MediaRelation, 
  Recommendation 
} from './anime';

export interface Manga {
  id: number;
  idMal?: number;
  type: MediaType;
  format?: MediaFormat;
  status?: MediaStatus;
  title: Title;
  description?: string;
  coverImage: CoverImage;
  bannerImage?: string;
  chapters?: number;
  volumes?: number;
  genres: string[];
  tags?: Tag[];
  averageScore?: number;
  meanScore?: number;
  popularity?: number;
  favourites?: number;
  trending?: number;
  startDate?: FuzzyDate;
  endDate?: FuzzyDate;
  relations?: { nodes: MediaRelation[] };
  recommendations?: { nodes: Recommendation[] };
  externalLinks?: any[];
  siteUrl?: string;
}

export interface MangaDetail extends Manga {
  mangadexData?: {
    mangadexId: string;
    liveChapterCount: number | null;
    liveVolumeCount: number | null;
    status: string;
  };
}

export interface MangaChapter {
  id: string;
  number: number;
  title?: string;
  volume?: number;
  publishDate?: string;
  pages?: number;
}

export interface MangaVolume {
  number: number;
  chapters: MangaChapter[];
}
