import React, { useState, useEffect, useRef, useCallback } from 'react';
import { connect } from 'react-redux';
import { fetchSearch, clearResults } from '../Redux/actions';
import ResultsContainer from '../Containers/ResultsContainer';

const Search = ({ fetchSearch, spotifyApi }) => {
  const [query, setQuery] = useState({ search: '' });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setQuery({ [name]: value });
  };

  useEffect(() => {
    if (query.search === '') {
      console.log('empty search field');
    } else {
      fetchSearch(query.search, spotifyApi);
    }
    return () => {
      // need to fix
      clearResults();
    };
  }, [query, fetchSearch]);

  return (
    <>
      <h2>Begin playlist with an item from your search or...</h2>
      <form>
        <input
          type="text"
          name="search"
          placeholder="track title or artist name..."
          value={query.search}
          onChange={handleChange}
          autoComplete="off"
        />
      </form>

      <ResultsContainer spotifyApi={spotifyApi} />
    </>
  );
};

export default connect(null, { fetchSearch, clearResults })(Search);
