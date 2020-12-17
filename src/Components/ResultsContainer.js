import React from 'react'
import Result from './Result'
import {connect} from 'react-redux';
import './ResultsContainer.css'

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
            {searchResults ?
                <>
                <div className="results">
                    <div className="artists-results">
                        <h3>Artists</h3>
                        {renderArtists()}
                    </div>
                    <div className="track-results">
                        <h3>Tracks</h3>
                        {renderTracks()}
                    </div>
                </div>
                </>
            :
            undefined}
        </>
    )
}

export default connect(msp)(ResultsContainer);