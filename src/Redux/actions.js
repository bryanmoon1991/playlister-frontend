export const fetchCurrentUser = id => {
    return dispatch => {
        fetch(`http://localhost:3000/api/v1/users/${id}`)
            .then(response => response.json())
            .then(user => {
                console.log(user)
                dispatch({type: 'FETCH_CURRENT_USER', payload: user})
            })
    }
};