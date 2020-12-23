import React from 'react'
import {connect} from 'react-redux';
import {motion} from 'framer-motion';
import Result from '../Components/Result'
import '../Styles/ResultsContainer.css'

const msp = state => {
    return {
        searchResults: state.searchResults
    }
}

const ResultsContainer = ({searchResults, spotifyApi}) => {

    const renderArtists = () => {
        return searchResults.artists.map(artist => <Result key={artist.id} artist={artist} spotifyApi={spotifyApi}/>)
    }

    const renderTracks = () => {
        return searchResults.tracks.map(track => <Result key={track.id} track={track} spotifyApi={spotifyApi}/>)
    }

    return (
        <>
            {searchResults ?
                <>
                <motion.div 
                className="results"
                animate="open"
                >
                    <div className="artists-results">
                        <h3>Artists</h3>
                        {renderArtists()}
                    </div>
                    <div className="track-results">
                        <h3>Tracks</h3>
                        {renderTracks()}
                    </div>
                </motion.div>
                </>
            :
            undefined}
        </>
    )
}

export default connect(msp)(ResultsContainer);