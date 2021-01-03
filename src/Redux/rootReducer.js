import { combineReducers } from 'redux';
import produce from 'immer';

import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const defaultState = {
  user: null,
  searchResults: null,
  recommended: [],
  playlistBuild: {},
  relatedArtists: {},
  currentSelection: {},
  stack: [],
  playlists: [],
  preview: [],
};

const currentUserReducer = (state = defaultState.user, action) => {
  switch (action.type) {
    case 'FETCH_CURRENT_USER':
      return action.payload;
    default:
      return state;
  }
};

const currentUsersPlaylistsReducer = (
  state = defaultState.playlists,
  action
) => {
  switch (action.type) {
    case 'GET_MY_PLAYLISTS':
      return action.payload;
    default:
      return state;
  }
};

const searchReducer = (state = defaultState.searchResults, action) => {
  switch (action.type) {
    case 'TYPE_TO_SEARCH':
      return action.payload;
    case 'CLEAR_RESULTS':
      return action.payload;
    default:
      return state;
  }
};

const recommendedReducer = (state = defaultState.recommended, action) => {
  switch (action.type) {
    case 'RECOMMENDED_ARTISTS_AND_TRACKS':
      return action.payload;
    default:
      return state;
  }
};

const playlistBuildReducer = (state = defaultState.playlistBuild, action) => {
  switch (action.type) {
    case 'PLAYLIST_BUILD':
      return action.payload;
    case 'DELETE_BUILD':
      return action.payload;
    default:
      return state;
  }
};

const relatedArtistsReducer = produce((draft, action) => {
  switch (action.type) {
    case 'RELATED_ARTISTS':
      return action.payload;
    case 'ADD_TOP_TRACK':
      draft.artists[action.index]['track'] = action.payload;
      break;
  }
}, defaultState.relatedArtists);

const currentSelectionReducer = produce((draft, action) => {
  switch (action.type) {
    case 'SWITCH_CURRENT':
      return action.payload;
    case 'ADD_MORE':
      draft.albums = [...draft.albums, ...action.payload];
      break;
  }
}, defaultState.currentSelection);

const stackReducer = produce((draft, action) => {
  switch (action.type) {
    case 'INITIALIZE':
      draft.length = 0;
      draft.push(action.payload);
      return draft;
  }
}, defaultState.stack);

const previewReducer = produce((draft, action) => {
  switch (action.type) {
    case 'PREVIEW_TRACKS':
      let uniqueTracks = [];
      let uniqueTracksIds = [...new Set(draft.map((track) => track.id))];

      action.payload.forEach((track) => {
        if (!uniqueTracksIds.includes(track.id)) {
          uniqueTracks.push(track);
        }
      });

      draft = [...draft, ...uniqueTracks];
      // i guess i need this ?
      return draft;
    case 'REMOVE_PREVIEW':
      let index = draft.findIndex((track) => track.id === action.payload.id);
      draft.splice(index, 1);
      return draft;
    case 'CLEAR_TRACKS':
      return action.payload;
  }
}, defaultState.preview);

// const playlistSeedsReducer = produce((draft, action) => {
//     switch (action.type) {
//         case 'FIRST_SEED':
//             draft.length = 0;
//             draft.push(action.payload)
//             return draft
//         case 'CREATE_SEEDS':
//             return action.payload
//         case 'NO_SEEDS':
//             return action.payload
//         case 'ADD_SEED':
//             draft.push(action.payload)
//             return draft;
//         case 'REMOVE_SEED':
//             const index = draft.findIndex(seed => seed.id === action.payload.id)
//             if (index !== -1) draft.splice(index, 1)
//     }
// }, defaultState.playlistSeeds)

const persistConfig = {
  key: 'root',
  storage,
  whitelist: [
    'user',
    'recommended',
    'playlistBuild',
    'relatedArtists',
    'currentSelection',
    'stack',
    'playlists',
    'preview',
  ],
};

const rootReducer = combineReducers({
  user: currentUserReducer,
  searchResults: searchReducer,
  recommended: recommendedReducer,
  playlistBuild: playlistBuildReducer,
  relatedArtists: relatedArtistsReducer,
  currentSelection: currentSelectionReducer,
  stack: stackReducer,
  playlists: currentUsersPlaylistsReducer,
  preview: previewReducer,
});

export default persistReducer(persistConfig, rootReducer);
