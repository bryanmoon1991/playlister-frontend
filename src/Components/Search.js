import React, {useState} from 'react';
import {connect} from 'react-redux';
import {fetchSearch} from '../Redux/actions'
import ResultsContainer from './ResultsContainer';
var Spotify = require('spotify-web-api-js');
var spotifyApi = new Spotify()


const msp = (state) => {
    return {
        user: state.user,
        searchResults: state.searchResults
    }
}

const Search = ({user, searchResults, fetchSearch}) => {
    spotifyApi.setAccessToken(user.access_token)

    // const [query, setQuery] = useReducer((state, newState) => ({ ...state, ...newState }), { search: '' });
    const [query, setQuery] = useState({search: ''})

    const handleChange = (event) => {
        const { name, value } = event.target;
        setQuery({ [name]: value });
        fetchSearch(spotifyApi, query.search)
        // console.log("in search", searchResults)
    };



    // useEffect(() => {
    //     fetch(`https://api.spotify.com/v1/search?q=${query.search.split(" ").join("%20")}&type=artist,track`)
    //     .then(response => response.json())
    //     .then(data => function(data)); 
    // }, [query])

    return (
      <>
        <form>
          <input
            type="text"
            name="search"
            placeholder="track title or artist name..."
            value={query.search}
            onChange={handleChange}
          />
        </form>
        {searchResults ?
        <ResultsContainer/> :
        undefined
        }
      </>
    );
}


export default connect(msp, {fetchSearch})(Search);