import { type NormalizedSearchResult } from '../../store/useSearchStore';
import { fetchKlipy } from './klipyClient';

export async function searchStaticMemes(query: string): Promise<NormalizedSearchResult[]> {
  const json = await fetchKlipy('/static-memes/search', query);
  const data = json.data.data || [];

  return data.map((item: any): NormalizedSearchResult => {
    const md = item.file?.md?.png;
    const hd = item.file?.hd?.png || md;
    return {
      id: item.id || crypto.randomUUID(),
      type: 'meme',
      width: md?.width || 0,
      height: md?.height || 0,
      previewUrl: md?.url || '',
      displayUrl: md?.url || '',
      originalUrl: hd?.url || '',
      blurPreview: item.blur_preview || '',
      format: 'png'
    };
  });
}
