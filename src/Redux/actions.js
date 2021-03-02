import produce from 'immer';
import chunk from 'lodash.chunk';
import { API_ROOT } from '../apiRoot';

const refresh = async (id) => {
	try {
		let response = await fetch(`${API_ROOT}api/v1/users/${id}`);

		if (!response.ok) {
			throw new Error(`error in fetch. Status: ${response.status}`);
		} else {
			let newUser = await response.json();
			console.log('REFRESHED THE TOKEN:', newUser);
			return newUser;
		}
	} catch (err) {
		console.log('REFRESH FAILED:', err);
	}
};

const getMore = (next, spotifyApi, dispatch) => {
	if (next) {
		fetch(next, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + spotifyApi.getAccessToken(),
			},
		})
			.then((r) => r.json())
			.then((data) => {
				// prettier-ignore
				Promise.all([
          spotifyApi.getAlbums(data.items.map((album) => album.id)),
          spotifyApi.containsMySavedAlbums(data.items.map((album) => album.id))
        ])
          .then(([albumObjects, followingAlbums]) => {
            for (let i = 0; i < data.items.length; i++) {
              data.items[i]['tracks'] = albumObjects.albums[i].tracks;
              data.items[i]['saved'] = followingAlbums[i]
            }
            let firstFiltered = data.items.filter(album => album.images.length > 0)
            let names = []
            let filtered = []
            firstFiltered.forEach(album => {
              if (!names.includes(album.name)) {
                filtered.push(album)
                names.push(album.name)
              }
            })
            dispatch({
              type: 'ADD_MORE',
              payload: filtered,
            });
          });
				if (data.next) {
					getMore(data.next, spotifyApi, dispatch);
				}
			});
	}
};

export const fetchCurrentUser = (id) => {
	return (dispatch) => {
		fetch(`${API_ROOT}api/v1/users/${id}`)
			.then((response) => response.json())
			.then((user) => {
				dispatch({ type: 'FETCH_CURRENT_USER', payload: user });
			});
	};
};

export const fetchCurrentUsersBuilds = (userId) => {
	return (dispatch) => {
		fetch(`${API_ROOT}api/v1/users/${userId}/playlists`)
			.then((response) => response.json())
			.then((data1) => {
				dispatch({
					type: 'GET_MY_PLAYLISTS',
					payload: data1,
				});
			});
	};
};

export const fetchSearch = (query, spotifyApi) => {
	return (dispatch, getState) => {
		spotifyApi.searchArtists(query, { limit: 5 }).then(
			(data) => {
				dispatch({
					type: 'TYPE_TO_SEARCH',
					payload: data.artists.items,
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
					fetchSearch(query, spotifyApi);
				});
			}
		);
	};
};

export const clearResults = () => {
	return (dispatch) => {
		dispatch({
			type: 'CLEAR_RESULTS',
			payload: null,
		});
		dispatch({
			type: 'CLEAR_TRACKS',
			payload: [],
		});
		dispatch({
			type: 'RELATED_ARTISTS',
			payload: {},
		});
		dispatch({
			type: 'PLAYLIST_BUILD',
			payload: {},
		});
		dispatch({
			type: 'SWITCH_CURRENT',
			payload: {},
		});
	};
};

export const fetchRecommended = (spotifyApi) => {
	return (dispatch, getState) => {
		spotifyApi.setAccessToken(getState().user.access_token);
		spotifyApi.getMyTopArtists({ limit: 10 }).then(
			(artists) => {
				dispatch({
					type: 'RECOMMENDED_ARTISTS_AND_TRACKS',
					payload: {
						artists: artists,
						images: artists.items.map((item) => item.images[1]),
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
					fetchRecommended(spotifyApi);
				});
			}
		);
	};
};

export const startNew = (userId, selection, spotifyApi) => {
	return (dispatch) => {
		Promise.all([
			fetch(`${API_ROOT}api/v1/playlists`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
				},
				body: JSON.stringify({
					user_id: userId,
					name: 'newPlaylist',
					public: false,
					collaborative: false,
					published: false,
					description: 'Playlist created with Perfect Playlist',
					href: '',
					spotify_id: '',
					history: [selection],
					images: {},
					items: [selection],
					uri: '',
				}),
			}).then((r) => r.json()),
			spotifyApi.getArtistRelatedArtists(selection.id),
			spotifyApi
				.getArtistRelatedArtists(selection.id)
				.then((data) =>
					spotifyApi.isFollowingArtists(data.artists.map((artist) => artist.id))
				),
			spotifyApi.getArtist(selection.id),
			spotifyApi
				.getArtist(selection.id)
				.then((data) => spotifyApi.isFollowingArtists([data.id])),
			spotifyApi.getArtistAlbums(selection.id, { limit: 20, country: 'US' }),
			spotifyApi
				.getArtistAlbums(selection.id, { limit: 20, country: 'US' })
				.then((data) =>
					spotifyApi.containsMySavedAlbums(data.items.map((album) => album.id))
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
					spotifyApi.containsMySavedTracks(data.tracks.map((track) => track.id))
				),
		]).then(
			([
				playlistBuild,
				relatedArtists,
				following,
				currentArtist,
				followCurrent,
				currentArtistAlbums,
				followAlbums,
				fullAlbums,
				currentArtistTopTracks,
				followTracks,
			]) => {
				for (let i = 0; i < relatedArtists.artists.length; i++) {
					relatedArtists.artists[i]['following'] = following[i];
				}
				dispatch({
					type: 'PLAYLIST_BUILD',
					payload: playlistBuild,
				});
				dispatch({
					type: 'RELATED_ARTISTS',
					payload: relatedArtists,
				});
				currentArtist['following'] = followCurrent[0];
				for (let i = 0; i < currentArtistTopTracks.tracks.length; i++) {
					currentArtistTopTracks.tracks[i]['saved'] = followTracks[i];
				}
				for (let i = 0; i < currentArtistAlbums.items.length; i++) {
					currentArtistAlbums.items[i]['tracks'] = fullAlbums.albums[i].tracks;
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
				refresh(userId).then((data) => {
					dispatch({
						type: 'FETCH_CURRENT_USER',
						payload: data,
					});
					spotifyApi.setAccessToken(data.access_token);
					startNew(userId, selection, spotifyApi);
				});
			}
		);
	};
};

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
				fetch(`${API_ROOT}api/v1/playlists/${getState().playlistBuild.id}`, {
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json',
						Accept: 'application/json',
					},
					body: JSON.stringify({
						history: updatedHistory,
					}),
				}).then((r) => r.json()),
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
				fetch(`${API_ROOT}api/v1/playlists/${getState().playlistBuild.id}`, {
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json',
						Accept: 'application/json',
					},
					body: JSON.stringify({
						history: updatedHistory,
					}),
				}).then((r) => r.json()),
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

export const continueBuild = (selection, spotifyApi) => {
	return (dispatch, getState) => {
		if (selection.type === 'artist') {
			Promise.all([
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
			Promise.all([
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

export const goBack = (selection, spotifyApi) => {
	return (dispatch, getState) => {
		if (selection.type === 'artist') {
			let updatedHistory = produce(
				getState().playlistBuild.history,
				(draft) => {
					draft.pop();
				}
			);
			Promise.all([
				fetch(`${API_ROOT}api/v1/playlists/${getState().playlistBuild.id}`, {
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json',
						Accept: 'application/json',
					},
					body: JSON.stringify({
						history: updatedHistory,
					}),
				}).then((r) => r.json()),
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
					draft.pop();
				}
			);
			Promise.all([
				fetch(`${API_ROOT}api/v1/playlists/${getState().playlistBuild.id}`, {
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json',
						Accept: 'application/json',
					},
					body: JSON.stringify({
						history: updatedHistory,
					}),
				}).then((r) => r.json()),
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

export const addSeed = (item, images = null) => {
	return (dispatch, getState) => {
		let newItems;
		let id = getState().playlistBuild.id;
		if (item.type === 'track') {
			let newTrack = produce(item, (draft) => {
				draft['images'] = images;
			});
			newItems = produce(getState().playlistBuild.items, (draft) => {
				draft.push(newTrack);
			});
		} else {
			newItems = produce(getState().playlistBuild.items, (draft) => {
				draft.push(item);
			});
		}
		fetch(`${API_ROOT}api/v1/playlists/${id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
			body: JSON.stringify({
				items: newItems,
			}),
		})
			.then((r) => r.json())
			.then((data) => {
				dispatch({
					type: 'PLAYLIST_BUILD',
					payload: data,
				});
			});
	};
};

// think about refactoring this so it receives playlist build in props instead so you can remove getstate()
export const removeSeed = (seed, playlistId) => {
	return (dispatch, getState) => {
		let removedArray = produce(getState().playlistBuild.items, (draft) => {
			const index = draft.findIndex((obj) => obj.id === seed.id);
			if (index !== -1) draft.splice(index, 1);
		});
		fetch(`${API_ROOT}api/v1/playlists/${playlistId}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
			body: JSON.stringify({
				items: removedArray,
			}),
		})
			.then((r) => r.json())
			.then((data) => {
				console.log(data);
				dispatch({
					type: 'PLAYLIST_BUILD',
					payload: data,
				});
			});
	};
};

export const loadBuild = (id) => {
	return (dispatch) => {
		fetch(`${API_ROOT}api/v1/playlists/${id}`)
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
	return (dispatch) => {
		fetch(`${API_ROOT}api/v1/playlists/${id}`, {
			method: 'DELETE',
		}).then(() => {
			dispatch({
				type: 'DELETE_BUILD',
				payload: {},
			});
		});
	};
};

export const updatePlaylist = (id, attribute, value) => {
	let body = {};
	body[attribute] = value;
	return (dispatch) => {
		fetch(`${API_ROOT}api/v1/playlists/${id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
			body: JSON.stringify(body),
		})
			.then((r) => r.json())
			.then((data) => {
				dispatch({
					type: 'PLAYLIST_BUILD',
					payload: data,
				});
			});
	};
};

export const addTracksToPreview = (tracks, spotifyApi) => {
	return (dispatch) => {
		if (tracks.length > 50) {
			let chunks = chunk(tracks, 50);
			chunks.forEach((chonk) => {
				spotifyApi
					.getArtists(chonk.map((track) => track.artists[0].id))
					.then((data) => {
						let mutated = JSON.parse(JSON.stringify(chonk));
						mutated.defaultForm = true;
						for (let i = 0; i < data.artists.length; i++) {
							mutated[i]['artists'] = [data.artists[i]];
						}
						dispatch({
							type: 'PREVIEW_TRACKS',
							payload: mutated,
						});
					});
			});
		} else {
			spotifyApi
				.getArtists(tracks.map((track) => track.artists[0].id))
				.then((data) => {
					let mutated = JSON.parse(JSON.stringify(tracks));
					mutated.defaultForm = true;
					for (let i = 0; i < data.artists.length; i++) {
						mutated[i]['artists'] = [data.artists[i]];
					}
					dispatch({
						type: 'PREVIEW_TRACKS',
						payload: mutated,
					});
				});
		}
	};
};

export const clearPreview = () => {
	return (dispatch) => {
		dispatch({
			type: 'CLEAR_TRACKS',
			payload: [],
		});
	};
};

export const removePreview = (seed) => {
	return (dispatch) => {
		dispatch({
			type: 'REMOVE_PREVIEW',
			payload: seed,
		});
	};
};

export const handleLogout = () => {
	return (dispatch) => {
		dispatch({
			type: 'LOGOUT',
		});
	};
};

export const publishBuild = (id, tracks, spotifyApi) => {};
