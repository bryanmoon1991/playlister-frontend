import React from 'react'
import { connect } from 'react-redux'
import './ArtistCard.css'

const msp = state => {
    return {
        currentArtist: state.currentArtist
    }
}

const ArtistCard = ({currentArtist}) => {
    console.log("artist card", currentArtist)

    const renderGenres = () => {
        return currentArtist.info.genres.join(", ")
    }

    
    return (
        <>
        {currentArtist.info ? 
            <div className='artist-card'>
                <img 
                src={currentArtist.info.images[0].url}
                alt="artist"
                className="artist-picture"
                />
                <div className="info">
                    <h3>{currentArtist.info.name}</h3>
                    <h4>Followers: {currentArtist.info.followers.total}</h4>
                    <p>{renderGenres()}</p>
                </div>
            </div>
        :
            <h3>Loading Discovery Tool</h3>
        }
        </>
    )
}

export default connect(msp)(ArtistCard);