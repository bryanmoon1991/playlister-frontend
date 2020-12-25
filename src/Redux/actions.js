import produce from 'immer';

const refresh = async (id) => {
  try {
    let response = await fetch(`http://localhost:3000/api/v1/users/${id}`)

    if (!response.ok) {
      throw new Error(`error in fetch. Status: ${response.status}`)
    } else {
      let newUser = await response.json()
      console.log("REFRESHED THE TOKEN:", newUser)
      return newUser
    }
  } catch(err) {
    console.log("REFRESH FAILED:", err)
  }
}

export const fetchCurrentUser = id => {
  return dispatch => {
    fetch(`http://localhost:3000/api/v1/users/${id}`)
    .then(response => response.json())
    .then(user => {
      dispatch({type: 'FETCH_CURRENT_USER', payload: user})
    })
  }
};


export const fetchCurrentUsersBuilds = userId => {
  return dispatch => {
      fetch(`http://localhost:3000/api/v1/users/${userId}/playlists`)
      .then(response => response.json())
      .then(data1 => {
        dispatch({
          type: 'GET_MY_PLAYLISTS',
          payload: data1
        });
    });
  }
}

export const fetchSearch = (query, spotifyApi) => {
    return (dispatch, getState) => {
      spotifyApi.setAccessToken(getState().user.access_token);
      Promise.all([
        spotifyApi.searchArtists(query, { limit: 5 }),
        spotifyApi.searchTracks(query, { limit: 5 }),
        ])
          .then(([data1, relatedArtists]) => {
            dispatch({
              type: 'TYPE_TO_SEARCH',
              payload: {
                artists: data1.artists.items,
                tracks: relatedArtists.tracks.items,
              },
            });
          },
            (err) => {
              console.log('error', err);
              refresh(getState().user.id).then((data) => {
                dispatch({
                  type: 'FETCH_CURRENT_USER',
                  payload: data,
                });
                spotifyApi.setAccessToken(data.access_token)
                fetchSearch(query, spotifyApi);
              });
            });
    }
}

export const clearResults = () => {
  return dispatch => {
    dispatch({
      type: 'CLEAR_RESULTS',
      payload: null
    })
  }
}



  
  export const fetchRecommended = (spotifyApi) => {
    return (dispatch, getState) => {
      spotifyApi.setAccessToken(getState().user.access_token)
      spotifyApi.getMyTopArtists({ limit: 10 }) 
      .then(artists => {
        dispatch({
          type: 'RECOMMENDED_ARTISTS_AND_TRACKS',
          payload: {
            artists: artists,
            images: artists.items.map((item) => item.images[1]),
          },
        });
      }, err => {
        console.log("error", err)
        refresh(getState().user.id)
        .then(data => {
          dispatch({
            type: 'FETCH_CURRENT_USER',
            payload: data
          })
          spotifyApi.setAccessToken(data.access_token)
          fetchRecommended(spotifyApi)
        })
        
      })
  };
}

export const startNew = (userId, selection, spotifyApi) => {
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
          items: [selection], 
          uri: '',
        }),
      }).then((r) => r.json()),
      spotifyApi.getArtistRelatedArtists(selection.id),
      spotifyApi.getArtist(selection.id),
      spotifyApi.getArtistAlbums(selection.id),
      spotifyApi.getArtistTopTracks(selection.id, 'US'),
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
        let usAlbums = currentArtistAlbums.items.filter(item => item.available_markets.includes("US"))
        dispatch({
          type: 'SWITCH_CURRENT',
          payload: {
            info: currentArtist,
            albums: usAlbums,
            tracks: currentArtistTopTracks.tracks,
          },
        });
        
      }, err => {
        console.log("error", err)
        refresh(userId)
        .then(data => {
          dispatch({
            type: 'FETCH_CURRENT_USER',
            payload: data
          })
          spotifyApi.setAccessToken(data.access_token)
          startNew(userId, selection, spotifyApi)
        })
        
      }
    );
  }
};

export const createNext = (selection, spotifyApi) => {
  return (dispatch, getState) => {
    spotifyApi.setAccessToken(getState().user.access_token);
    Promise.all([
      spotifyApi.getArtist(selection.id),
      spotifyApi.getArtistAlbums(selection.id),
      spotifyApi.getArtistTopTracks(selection.id, 'US'),
      spotifyApi.getArtistRelatedArtists(selection.id)
    ])
    .then(([
      currentArtist,
      currentArtistAlbums,
      currentArtistTopTracks,
      relatedArtists,
    ]) => {
      dispatch({
        type: 'RELATED_ARTISTS',
        payload: relatedArtists,
      });
      let usAlbums = currentArtistAlbums.items.filter((item) =>
        item.available_markets.includes('US')
      );
      dispatch({
        type: 'SWITCH_CURRENT',
        payload: {
          info: currentArtist,
          albums: usAlbums,
          tracks: currentArtistTopTracks.tracks,
        },
      });
    },
      (err) => {
        console.log('error', err);
        refresh(getState().user.id).then((data) => {
          dispatch({
            type: 'FETCH_CURRENT_USER',
            payload: data,
          });
          spotifyApi.setAccessToken(data.access_token);
          startNew(selection, spotifyApi);
        });
      })

  } 
}

export const addSeed = (artist) => {
  return (dispatch, getState) => {
    let id = getState().playlistBuild.id
    let newItems = produce(getState().playlistBuild.items, draft => {
      draft.push(artist)
    })
    fetch(`http://localhost:3000/api/v1/playlists/${id}`,{
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json"
            },
            body: JSON.stringify({
              items: newItems
            })
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
