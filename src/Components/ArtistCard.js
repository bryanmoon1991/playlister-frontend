import React from 'react'
import { connect } from 'react-redux'

const msp = state => {
    return {
        currentArtist: state.currentArtist
    }
}

const ArtistCard = ({currentArtist}) => {
    console.log(currentArtist)
    return (
        <>
        {currentArtist.info ? 
            <div className='artist-card'>
                <h3>{currentArtist.info.name}</h3>
                <img 
                src={currentArtist.info.images[0].url}
                alt="artist"
                />
            </div>
        :
            <h3>Loading Discovery Tool</h3>
        }
        </>
    )
}

export default connect(msp)(ArtistCard);