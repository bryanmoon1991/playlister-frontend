import { combineReducers } from 'redux';

const defaultState = {
  user: null,
  searchResults: null,
  recommended: [],
  playlistBuild: {},
  relatedArtists: {},
  currentArtist: {},
};

const currentUserReducer = (state = defaultState.user, action) => {
  switch (action.type) {
    case 'FETCH_CURRENT_USER':
      return action.payload;
    default:
      return state;
  }
};

const searchReducer = (state = defaultState.searchResults, action) => {
  switch (action.type) {
    case 'TYPE_TO_SEARCH':
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
    default:
      return state;
  }
};

const relatedArtistsReducer = (
  state = defaultState.relatedArtists,
  action
) => {
  switch (action.type) {
    case 'RELATED_ARTISTS':
      return action.payload;
    default:
      return state;
  }
};

const currentArtistReducer = (state = defaultState.currentArtist, action) => {
  switch (action.type) {
    case 'CURRENT_ARTIST':
      return action.payload;
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  user: currentUserReducer,
  searchResults: searchReducer,
  recommended: recommendedReducer,
  playlistBuild: playlistBuildReducer,
  relatedArtists: relatedArtistsReducer,
  currentArtist: currentArtistReducer,
});

export default rootReducer;
