import { Image } from './base';

interface ArtistExternalURLs {
  spotify: string;
}

interface AlbumObject {
  id: number;
  name: string;
  images: Image[];
  artists: Artist[];
  saved: boolean;
  external_urls: ArtistExternalURLs;
  tracks: Track[];
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
  id: number;
  name: string;
  preview_url: string;
}

export interface SpotifyResponse {
  tracks: Track[];
}

export interface Album {
  info: AlbumObject;
  features: Artist[];
  tracks: Track[];
}
