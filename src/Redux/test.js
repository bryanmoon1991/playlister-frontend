export const createNext = (selection, spotifyApi) => {
  return (dispatch, getState) => {
    if (selection.type === 'artist') {
      let updatedHistory = produce(
        getState().playlistBuild.history,
        (draft) => {
          draft.push(selection);
        }
      );
      Promise.all([
        fetch(
          `http://localhost:3000/api/v1/playlists/${
            getState().playlistBuild.id
          }`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body: JSON.stringify({
              history: updatedHistory,
            }),
          }
        ).then((r) => r.json()),
        spotifyApi.getArtist(selection.id),
        spotifyApi
          .getArtist(selection.id)
          .then((data) => spotifyApi.isFollowingArtists([data.id])),
        spotifyApi.getArtistAlbums(selection.id, { limit: 20, country: 'US' }),
        spotifyApi
          .getArtistAlbums(selection.id, { limit: 20, country: 'US' })
          .then((data) =>
            spotifyApi.containsMySavedAlbums(
              data.items.map((album) => album.id)
            )
          ),
        // prettier-ignore
        spotifyApi.getArtistAlbums(selection.id, { limit: 20, country: 'US' })
          .then((albums) =>
            spotifyApi.getAlbums(albums.items.map((alb) => alb.id))
          ),
        spotifyApi.getArtistTopTracks(selection.id, 'US'),
        spotifyApi
          .getArtistTopTracks(selection.id, 'US')
          .then((data) =>
            spotifyApi.containsMySavedTracks(
              data.tracks.map((track) => track.id)
            )
          ),
        spotifyApi.getArtistRelatedArtists(selection.id),
        spotifyApi
          .getArtistRelatedArtists(selection.id)
          .then((data) =>
            spotifyApi.isFollowingArtists(
              data.artists.map((artist) => artist.id)
            )
          ),
      ]).then(
        ([
          updatedBuild,
          currentArtist,
          followCurrent,
          currentArtistAlbums,
          followAlbums,
          fullAlbums,
          currentArtistTopTracks,
          followTracks,
          relatedArtists,
          following,
        ]) => {
          for (let i = 0; i < relatedArtists.artists.length; i++) {
            relatedArtists.artists[i]['following'] = following[i];
          }
          currentArtist['following'] = followCurrent[0];
          for (let i = 0; i < currentArtistTopTracks.tracks.length; i++) {
            currentArtistTopTracks.tracks[i]['saved'] = followTracks[i];
          }
          for (let i = 0; i < currentArtistAlbums.items.length; i++) {
            currentArtistAlbums.items[i]['tracks'] =
              fullAlbums.albums[i].tracks;
            currentArtistAlbums.items[i]['saved'] = followAlbums[i];
          }
          let firstFiltered = currentArtistAlbums.items.filter(
            (album) => album.images.length > 0
          );
          let names = [];
          let filtered = [];
          firstFiltered.forEach((album) => {
            if (!names.includes(album.name)) {
              filtered.push(album);
              names.push(album.name);
            }
          });
          dispatch({
            type: 'PLAYLIST_BUILD',
            payload: updatedBuild,
          });
          dispatch({
            type: 'RELATED_ARTISTS',
            payload: relatedArtists,
          });
          dispatch({
            type: 'SWITCH_CURRENT',
            payload: {
              info: currentArtist,
              albums: filtered,
              tracks: currentArtistTopTracks.tracks,
            },
          });
          getMore(currentArtistAlbums.next, spotifyApi, dispatch);
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
        }
      );
    } else if (selection.type === 'album') {
      let updatedHistory = produce(
        getState().playlistBuild.history,
        (draft) => {
          draft.push(selection);
        }
      );
      Promise.all([
        fetch(
          `http://localhost:3000/api/v1/playlists/${
            getState().playlistBuild.id
          }`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body: JSON.stringify({
              history: updatedHistory,
            }),
          }
        ).then((r) => r.json()),
        spotifyApi.getAlbum(selection.id),
        spotifyApi
          .getAlbum(selection.id)
          .then((data) => spotifyApi.containsMySavedAlbums([data.id])),
        spotifyApi.getArtists(selection.artists.map((artist) => artist.id)),
        spotifyApi
          .getArtists(selection.artists.map((artist) => artist.id))
          .then((data) =>
            spotifyApi.isFollowingArtists(
              data.artists.map((artist) => artist.id)
            )
          ),
        spotifyApi.getArtistRelatedArtists(selection.artists[0].id),
        spotifyApi
          .getArtistRelatedArtists(selection.artists[0].id)
          .then((data) =>
            spotifyApi.isFollowingArtists(
              data.artists.map((artist) => artist.id)
            )
          ),
      ]).then(
        ([
          updatedBuild,
          currentAlbum,
          followAlbum,
          features,
          followFeatures,
          relatedArtists,
          following,
        ]) => {
          if (features.artists[0].name === 'Various Artists') {
            // FOLLOWING DOEST WORK HERE YET
            let allArtists = [];
            currentAlbum.tracks.items.forEach((track) =>
              track.artists.forEach((artist) => allArtists.push(artist.id))
            );
            let filteredArtists = [...new Set(allArtists)];
            Promise.all([
              spotifyApi.getArtists(filteredArtists),
              spotifyApi
                .getArtists(filteredArtists)
                .then((data) =>
                  spotifyApi.isFollowingArtists(
                    data.artists.map((artist) => artist.id)
                  )
                ),
            ]).then(([relatedArtists, following]) => {
              for (let i = 0; i < relatedArtists.artists.length; i++) {
                relatedArtists.artists[i]['following'] = following[i];
              }

              dispatch({
                type: 'SWITCH_CURRENT',
                payload: {
                  info: currentAlbum,
                  features: relatedArtists.artists,
                  tracks: currentAlbum.tracks.items,
                },
              });

              dispatch({
                type: 'PLAYLIST_BUILD',
                payload: updatedBuild,
              });

              dispatch({
                type: 'RELATED_ARTISTS',
                payload: relatedArtists,
              });
            });
          } else {
            currentAlbum['saved'] = followAlbum[0];
            for (let i = 0; i < features.artists.length; i++) {
              features.artists[i]['following'] = followFeatures[i];
            }
            dispatch({
              type: 'SWITCH_CURRENT',
              payload: {
                info: currentAlbum,
                features: features.artists,
                tracks: currentAlbum.tracks.items,
              },
            });

            dispatch({
              type: 'PLAYLIST_BUILD',
              payload: updatedBuild,
            });

            for (let i = 0; i < relatedArtists.artists.length; i++) {
              relatedArtists.artists[i]['following'] = following[i];
            }
            dispatch({
              type: 'RELATED_ARTISTS',
              payload: relatedArtists,
            });
          }
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
        }
      );
    }
  };
};
