import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import {fetchSearch} from '../Redux/actions'
import ResultsContainer from './ResultsContainer';


const Search = ({fetchSearch}) => {
    const [query, setQuery] = useState({search: ''})

    const handleChange = (event) => {
      const { name, value } = event.target;
      setQuery({ [name]: value });
    };

    useEffect(() => {
      if (query.search === '') {
        console.log("empty search field")
      } else {
        fetchSearch(query.search)
      }
    }, [query, fetchSearch])

    return (
      <>
      <h2>
        Begin playlist with an item from your search or...
      </h2>
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


export default connect(null, {fetchSearch})(Search);