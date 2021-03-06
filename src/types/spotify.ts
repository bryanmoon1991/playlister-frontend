import { Image } from './base';

interface ArtistExternalURLs {
  spotify: string;
}

export interface Artist {
  id: number;
  name: string;
  images: Image[];
  following: boolean;
  external_urls: ArtistExternalURLs;
}

export interface APIResponse {
  data: SpotifyResponse;
}

export interface Track {
  name: string;
  preview_url: string;
}

export interface SpotifyResponse {
  tracks: Track[];
}
