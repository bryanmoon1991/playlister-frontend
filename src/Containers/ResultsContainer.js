import React from 'react';
import { connect } from 'react-redux';
import Result from '../Components/Result';
import '../Styles/ResultsContainer.css';
import { List } from 'semantic-ui-react';

const msp = (state) => {
  return {
    searchResults: state.searchResults,
  };
};

const ResultsContainer = ({ searchResults, spotifyApi }) => {
  const renderResults = () => {
    if (searchResults.length) {
      return searchResults.map((artist) => (
        <Result key={artist.id} artist={artist} spotifyApi={spotifyApi} />
      ));
    } else {
      return undefined;
    }
  };

  return (
    <>
      {searchResults ? (
        <>
          <List size="huge" verticalAlign="middle" className="results">
            {renderResults()}
          </List>
        </>
      ) : undefined}
    </>
  );
};

export default connect(msp)(ResultsContainer);
