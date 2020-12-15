
export const fetchCurrentUser = id => {
    return dispatch => {
        fetch(`http://localhost:3000/api/v1/users/${id}`)
        .then(response => response.json())
        .then(user => {
            console.log(user)
            dispatch({type: 'FETCH_CURRENT_USER', payload: user})
        })
    }
};

export const fetchSearch = (spotifyApi, query) => {
    return dispatch => {
      Promise.all([
        spotifyApi.searchArtists(query, { limit: 5 }),
        spotifyApi.searchTracks(query, { limit: 5 }),
        ])
          .then(([data1, relatedArtists]) => {
            console.log(data1, relatedArtists);
            dispatch({
              type: 'TYPE_TO_SEARCH',
              payload: { artists: data1.artists.items, tracks: relatedArtists.tracks.items },
            });
          });
    }
}

export const fetchRecommended = (spotifyApi) => {
  return dispatch => {
    Promise.all([
      spotifyApi.getMyTopArtists({ limit: 5 }),
      spotifyApi.getMyTopTracks({ limit: 5 }),
    ]).then(([data1, relatedArtists]) => {
      console.log(data1, relatedArtists);
      dispatch({
        type: 'RECOMMENDED_ARTISTS_AND_TRACKS',
        payload: { artists: data1, tracks: relatedArtists, images:relatedArtists.items.map(item => item.album.images[2])},
      });
    });
  };
}

export const startNew = (userId, seedId, spotifyApi) => {
  return dispatch => {
    Promise.all([
      fetch('http://localhost:3000/api/v1/playlists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          name: 'newPlaylist',
          private: false,
          description: 'Playlist created with Perfect Playlist',
          href: '',
          spotify_id: '',
          images: '{}',
          items: `{${seedId}}`,
          uri: '',
        }),
      }).then((r) => r.json()),
      spotifyApi.getArtistRelatedArtists(seedId),
      spotifyApi.getArtist(seedId),
      spotifyApi.getArtistAlbums(seedId),
      spotifyApi.getArtistTopTracks(seedId,"US"),
    ]).then(
      ([
        playlistBuild,
        relatedArtists,
        currentArtist,
        currentArtistAlbums,
        currentArtistTopTracks,
      ]) => {
        console.log('in start NEW action:', playlistBuild, relatedArtists);
        dispatch({
          type: 'PLAYLIST_BUILD',
          payload: playlistBuild,
        });
        dispatch({
          type: 'INITIAL_DISCOVERY',
          payload: relatedArtists,
        });
        dispatch({
          type: 'CURRENT_ARTIST',
          payload: {
            info: currentArtist,
            albums: currentArtistAlbums.items,
            tracks: currentArtistTopTracks.tracks,
          },
        });
      }
    );
  }
};
