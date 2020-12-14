import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import {fetchSearch} from '../Redux/actions'
import ResultsContainer from './ResultsContainer';
var Spotify = require('spotify-web-api-js');
var spotifyApi = new Spotify()


const msp = (state) => {
  return {
    user: state.user,
  }
}

const Search = ({user, fetchSearch}) => {
  // potentially refactor into state
    spotifyApi.setAccessToken(user.access_token)

    // const [query, setQuery] = useReducer((state, newState) => ({ ...state, ...newState }), { search: '' });
    const [query, setQuery] = useState({search: ''})

    const handleChange = (event) => {
      const { name, value } = event.target;
      setQuery({ [name]: value });
    };

    useEffect(() => {
      if (query.search === '') {
        console.log("empty search field")
      } else {
        fetchSearch(spotifyApi, query.search)
      }
    }, [query, fetchSearch])

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
        <ResultsContainer/> 
      </>
    );
}


export default connect(msp, {fetchSearch})(Search);