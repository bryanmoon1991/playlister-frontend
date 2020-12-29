export const createNext = (selection, spotifyApi) => {
  return (dispatch, getState) => {
    if (selection.type === 'artist') {
      Promise.all([
        spotifyApi.getArtist(selection.id),
        spotifyApi.getArtistAlbums(selection.id, { limit: 50, country: 'US' }),
        spotifyApi.getArtistAlbums(selection.id, { limit: 50, country: 'US' })
        .then(albums => spotifyApi.getAlbums(albums.map(alb => alb.id))),
        spotifyApi.getArtistTopTracks(selection.id, 'US'),
        spotifyApi.getArtistRelatedArtists(selection.id),
      ]).then(
        ([
          currentArtist,
          currentArtistAlbums,
          extra,
          currentArtistTopTracks,
          relatedArtists,
        ]) => {
          dispatch({
            type: 'RELATED_ARTISTS',
            payload: relatedArtists,
          });
          dispatch({
            type: 'SWITCH_CURRENT',
            payload: {
              info: currentArtist,
              albums: currentArtistAlbums.items,
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
      Promise.all([
        spotifyApi.getAlbum(selection.id),
        spotifyApi.getArtists(selection.artists.map((artist) => artist.id)),
        spotifyApi.getArtistRelatedArtists(selection.artists[0].id),
      ]).then(
        ([currentAlbum, features, relatedArtists]) => {
          dispatch({
            type: 'RELATED_ARTISTS',
            payload: relatedArtists,
          });
          dispatch({
            type: 'SWITCH_CURRENT',
            payload: {
              info: currentAlbum,
              features: features.artists,
              tracks: currentAlbum.tracks.items,
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
        }
      );
    }
  };
};
