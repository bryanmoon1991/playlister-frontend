import {combineReducers} from 'redux';

const defaultState = {
    user: null
}

const currentUserReducer = (state = defaultState.user, action) => {
    switch (action.type) {
        case 'FETCH_CURRENT_USER':
            return action.payload
        default:
            return state
    }
}

const rootReducer = combineReducers({
    user: currentUserReducer
})

export default rootReducer