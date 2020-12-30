import React from 'react'
import {connect} from 'react-redux';
import Result from '../Components/Result'
import '../Styles/ResultsContainer.css'

const msp = state => {
    return {
        searchResults: state.searchResults
    }
}

const ResultsContainer = ({searchResults, spotifyApi}) => {

    const renderResults = () => {
        return searchResults.map(artist => <Result key={artist.id} artist={artist} spotifyApi={spotifyApi}/>)
    }

    return (
        <>
            {searchResults ?
                <>
                    <div className="results">
                        <div className="artists-results">
                            <h3>Artists</h3>
                            {renderResults()}
                        </div>
                    </div>
                </>
            :
            undefined}
        </>
    )
}

export default connect(msp)(ResultsContainer);