import { combineReducers } from 'redux';
import produce from 'immer';

import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const defaultState = {
  user: null,
  spotifyApi: null,
  searchResults: null,
  recommended: [],
  playlistBuild: {},
  relatedArtists: {},
  currentArtist: {},
  playlists: {},
};  

const currentUserReducer = (state = defaultState.user, action) => {
  switch (action.type) {
    case 'FETCH_CURRENT_USER':
      return action.payload;
    default:
      return state;
  }
};  


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

const spotifyApiReducer = (state = defaultState.spotifyApi, action) => {
    switch(action.type) {
      case 'SET_AUTHORIZATION':
            return action.payload;
        default:  
            return state;
    }        
}    

const currentUsersPlaylistsReducer = (state = defaultState.playlists, action) => {
    switch (action.type) {
        case 'GET_MY_PLAYLISTS':
            return action.payload;
        default:  
            return state;
    }        
}    

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




const relatedArtistsReducer = (state = defaultState.relatedArtists, action) => {
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

const persistConfig = {
  key: 'root',
  storage,
  whitelist: [
    'user',
    'spotifyApi',
    'recommended',
    'playlistBuild',
    'relatedArtists',
    'currentArtist',
    'playlists',
  ],
};


const rootReducer = combineReducers({
  user: currentUserReducer,
  spotifyApi: spotifyApiReducer,
  searchResults: searchReducer,
  recommended: recommendedReducer,
  playlistBuild: playlistBuildReducer,
  relatedArtists: relatedArtistsReducer,
  currentArtist: currentArtistReducer,
  playlists: currentUsersPlaylistsReducer,
});

export default persistReducer(persistConfig, rootReducer);
