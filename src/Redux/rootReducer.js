import { combineReducers } from 'redux';

const defaultState = {
  user: null,
  searchResults: null,
  recommended: [],
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

const rootReducer = combineReducers({
  user: currentUserReducer,
  searchResults: searchReducer,
  recommended: recommendedReducer,
});

export default rootReducer;
