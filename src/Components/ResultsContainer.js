import React from 'react'
import Result from './Result'
import {connect} from 'react-redux';

const msp = state => {
    return {
        searchResults: state.searchResults
    }
}

const ResultsContainer = ({searchResults}) => {

    const renderArtists = () => {
        return searchResults.artists.map(artist => <Result key={artist.id} artist={artist} />)
    }

    const renderTracks = () => {
        return searchResults.tracks.map(track => <Result key={track.id} track={track} />)
    }

    return (
        <>
        <h3>Artists</h3>
        {renderArtists()}
        <h3>Tracks</h3>
        {renderTracks()}
        </>
    )
}

export default connect(msp)(ResultsContainer);