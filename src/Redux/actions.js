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

export const fetchCurrentUsersPlaylists = (userId, spotifyApi) => {
  return dispatch => {
    Promise.all([
      spotifyApi.getUserPlaylists(),
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

export const fetchSearch = (query, spotifyApi) => {
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

export const startNew = (userId, artist, spotifyApi) => {
  return dispatch => {
    Promise.all([
      fetch('http://localhost:3000/api/v1/playlists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          name: 'newPlaylist',
          private: false,
          description: 'Playlist created with Perfect Playlist',
          href: '',
          spotify_id: '',
          images: {},
          items: [artist], 
          uri: '',
        }),
      }).then((r) => r.json()),
      spotifyApi.getArtistRelatedArtists(artist.id),
      spotifyApi.getArtist(artist.id),
      spotifyApi.getArtistAlbums(artist.id),
      spotifyApi.getArtistTopTracks(artist.id, 'US'),
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
        
      }
    );
  }
};

export const createNext = (artist, spotifyApi) => {
  return dispatch => {
    Promise.all([
      spotifyApi.getArtist(artist.id),
      spotifyApi.getArtistAlbums(artist.id),
      spotifyApi.getArtistTopTracks(artist.id, 'US'),
      spotifyApi.getArtistRelatedArtists(artist.id)
    ])
    .then(([
      currentArtist,
      currentArtistAlbums,
      currentArtistTopTracks,
      relatedArtists,
    ]) => {
      dispatch({
        type: 'RELATED_ARTISTS',
        payload: relatedArtists
      });
      dispatch({
        type: 'CURRENT_ARTIST',
        payload: {
          info: currentArtist,
          albums: currentArtistAlbums.items,
          tracks: currentArtistTopTracks.tracks,
        }
      })
    })

  } 
}

// think about refactoring this so it receives playlist build in props instead so you can remove getstate()
export const removeSeed = (seed, playlistId) => {
  return (dispatch, getState) => {
    let removedArray = produce(getState().playlistBuild.items, draft => {
      const index = draft.findIndex(obj => obj.id === seed.id);
      if (index !== -1) draft.splice(index, 1);
    })
    fetch(`http://localhost:3000/api/v1/playlists/${playlistId}`,{
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
              items: removedArray
            })
        })
        .then(r => r.json())
        .then(data => {
          console.log(data)
          dispatch({
            type: 'PLAYLIST_BUILD',
            payload: data
          })
        })
  }
}

export const loadBuild = (id) => {
  return dispatch => {
    fetch(`http://localhost:3000/api/v1/playlists/${id}`)
      .then((response) => response.json())
      .then((data) => {
        dispatch({
          type: 'PLAYLIST_BUILD',
          payload: data,
        });
      });
  };
};

export const deleteBuild = (id) => {
  return dispatch => {
    fetch(`http://localhost:3000/api/v1/playlists/${id}`, {
      method: 'DELETE'})
      .then(() => {
        dispatch({
          type: 'DELETE_BUILD',
          payload: {},
        });
      });
  }
}


export const updatePlaylist = (id, attribute, value) => {
  let body = {}
  body[attribute] = value
  return dispatch => {
    fetch(`http://localhost:3000/api/v1/playlists/${id}`,{
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(body)
        })
        .then(r => r.json())
        .then(data => {
          dispatch({
            type: 'PLAYLIST_BUILD',
            payload: data
          })
        })
  }
}
