export type { NormalizedSearchResult } from '../../store/useSearchStore';

export interface KlipySearchResponse {
  data: KlipyImageData[];
}

export interface KlipyImageData {
  id: string;
  blur_preview: string;
  file: {
    md: {
      png?: { url: string; width: number; height: number };
      gif?: { url: string; width: number; height: number };
    };
    hd: {
      png?: { url: string; width: number; height: number };
      gif?: { url: string; width: number; height: number };
    };
  };
}
