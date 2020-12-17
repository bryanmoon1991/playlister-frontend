import produce from 'immer';


export const fetchCurrentUser = id => {
    return dispatch => {
        fetch(`http://localhost:3000/api/v1/users/${id}`)
        .then(response => response.json())
        .then(user => {
            var Spotify = require('spotify-web-api-js');
            var spotifyApi = new Spotify();
            spotifyApi.setAccessToken(user.access_token)
            dispatch({type: 'FETCH_CURRENT_USER', payload: user})
            dispatch({type: 'SET_AUTHORIZATION', payload: spotifyApi})
        })
    }
};

export const fetchCurrentUsersPlaylists = userId => {
  return (dispatch, getState) => {
    Promise.all([
      getState().spotifyApi.getUserPlaylists(),
      fetch(`http://localhost:3000/api/v1/users/${userId}/playlists`)
        .then(response => response.json())
    ])
    .then(([data1, data2]) => {
      console.log("playlists:", data1, data2)
      dispatch({
        type: 'GET_MY_PLAYLISTS',
        payload: { published: data1, unPublished: data2 }
      });
    });
  }
}

export const fetchSearch = query => {
    return (dispatch, getState) => {
      Promise.all([
        getState().spotifyApi.searchArtists(query, { limit: 5 }),
        getState().spotifyApi.searchTracks(query, { limit: 5 }),
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

export const fetchRecommended = () => {
  return (dispatch, getState) => {
    Promise.all([
      getState().spotifyApi.getMyTopArtists({ limit: 5 }),
      getState().spotifyApi.getMyTopTracks({ limit: 5 }),
    ]).then(([data1, relatedArtists]) => {
      console.log(data1, relatedArtists);
      dispatch({
        type: 'RECOMMENDED_ARTISTS_AND_TRACKS',
        payload: { artists: data1, tracks: relatedArtists, images:relatedArtists.items.map(item => item.album.images[2])},
      });
    });
  };
}

export const startNew = (userId, artist) => {
  return (dispatch, getState) => {
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
          items: `{${artist.id}}`,
          uri: '',
        }),
      }).then((r) => r.json()),
      getState().spotifyApi.getArtistRelatedArtists(artist.id),
      getState().spotifyApi.getArtist(artist.id),
      getState().spotifyApi.getArtistAlbums(artist.id),
      getState().spotifyApi.getArtistTopTracks(artist.id, 'US'),
    ]).then(
      ([
        playlistBuild,
        relatedArtists,
        currentArtist,
        currentArtistAlbums,
        currentArtistTopTracks,
      ]) => {
        dispatch({
          type: 'PLAYLIST_BUILD',
          payload: playlistBuild,
        });
        dispatch({
          type: 'RELATED_ARTISTS',
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
        dispatch({
          type: 'ADD_SEED',
          payload: currentArtist
        })
      }
    );
  }
};


export const removeSeed = (seed, playlistBuild) => {
  let removedArray = produce(playlistBuild.items, draft => {
    const index = draft.findIndex(id => id === seed.id);
    if (index !== -1) draft.splice(index, 1);
  })
  return dispatch => {
    fetch(`http://localhost:3000/api/v1/playlists/${playlistBuild.id}`,{
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
              items: `{${removedArray.join(",")}}`
            })
        })
        .then(r => r.json())
        .then(data => {
          console.log(data)
          dispatch({
            type: 'PLAYLIST_BUILD',
            payload: data
          })
          dispatch({
            type: 'REMOVE_SEED',
            payload: seed
          })
        })
  }
}