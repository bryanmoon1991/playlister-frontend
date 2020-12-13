
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

export const fetchSearch = (spotifyApi, query) => {
    
    
    return (dispatch) => {
        Promise.all([
          spotifyApi.searchArtists(query, { limit: 10 }),
          spotifyApi.searchTracks(query, { limit: 10 }),
        ])
          // .then(([res1, res2]) => Promise.all([res1.json(), res2.json()]))
          .then(([data1, data2]) => {
            console.log(data1, data2);
            dispatch({
              type: 'TYPE_TO_SEARCH',
              payload: { artists: data1.artists.items, tracks: data2.tracks.items },
            });
          });


        // fetch(`https://api.spotify.com/v1/search?q=${query.split(" ").join("%20")}&type=artist,track`)
        //   .then(response => response.json())
        //   .then(data => function(data));
    }
}