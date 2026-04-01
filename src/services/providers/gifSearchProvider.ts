import { type NormalizedSearchResult } from '../../store/useSearchStore';
import { fetchKlipy } from './klipyClient';

export async function searchGifs(query: string): Promise<NormalizedSearchResult[]> {
  const json = await fetchKlipy('/gifs/search', query);
  const data = json.data.data || [];

  return data.map((item: any): NormalizedSearchResult => {
    const md = item.file?.md?.gif;
    const hd = item.file?.hd?.gif || md;

    return {
      id: item.id || crypto.randomUUID(),
      type: 'gif',
      width: md?.width || 0,
      height: md?.height || 0,
      previewUrl: md?.url || '',
      displayUrl: md?.url || '',
      originalUrl: hd?.url || '',
      blurPreview: item.blur_preview || '',
      format: 'gif'
    };
  });
}
