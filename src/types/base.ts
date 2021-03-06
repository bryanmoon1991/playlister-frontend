export interface Image {
  url: string
}

interface ArtistExternalURLs {
  spotify: string
}

export interface Artist {
  id: number
  name: string
  images: Image[]
  following: boolean
  external_urls: ArtistExternalURLs
}

export interface APIResponse {
  data: SpotifyResponse
}

export interface Track {
  name: string
  preview_url: string
}

export interface SpotifyResponse {
  tracks: Track[]
}

// <ArtistCard
// addSeed={addSeed}
// spotifyApi={spotifyApi}
// followNotify={followNotify}
// unfollowNotify={unfollowNotify}
// saveNotify={saveNotify}
// unsaveNotify={unsaveNotify}
// addToBuildNotify={addToBuildNotify}
// />
// );
// case 'album':
// return (
// <AlbumCard
// album={currentSelection}
// addSeed={addSeed}
// spotifyApi={spotifyApi}
// followNotify={followNotify}
// unfollowNotify={unfollowNotify}
// saveNotify={saveNotify}
// unsaveNotify={unsaveNotify}
// addToBuildNotify={addToBuildNotify}
// />
