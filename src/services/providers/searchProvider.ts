import { klipyClient } from '@/services/providers/klipy/klipy.client';
import type { SearchProvider } from '@/services/providers/searchProvider.types';

export const searchProvider: SearchProvider = klipyClient;
