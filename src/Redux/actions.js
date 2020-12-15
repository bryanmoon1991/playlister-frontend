
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
          .then(([data1, data2]) => {
            console.log(data1, data2);
            dispatch({
              type: 'TYPE_TO_SEARCH',
              payload: { artists: data1.artists.items, tracks: data2.tracks.items },
            });
          });
    }
}

export const fetchRecommended = (spotifyApi) => {
  return dispatch => {
    Promise.all([
      spotifyApi.getMyTopArtists({ limit: 5 }),
      spotifyApi.getMyTopTracks({ limit: 5 }),
    ]).then(([data1, data2]) => {
      console.log(data1, data2);
      dispatch({
        type: 'RECOMMENDED_ARTISTS_AND_TRACKS',
        payload: { artists: data1, tracks: data2, images:data2.items.map(item => item.album.images[2])},
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
      })
        .then((r) => r.json()),
        spotifyApi.getArtistRelatedArtists(seedId, { limit: 5 })
    ])
      .then(([data1, data2]) => {
        console.log("in start NEW action:", data1, data2)
        dispatch({
          type: 'PLAYLIST_BUILD',
          payload: { playlistBuild: data1 }
        })
        dispatch({
          type: 'INITIAL_DISCOVERY',
          payload: { initialDiscovery: data2 }
        })
      });
  }
};
