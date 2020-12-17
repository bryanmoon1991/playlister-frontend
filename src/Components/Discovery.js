import React from 'react'
import { connect } from 'react-redux';
import ArtistBubble from './ArtistBubble';
import ArtistCard from './ArtistCard'
import './Discovery.css'

const msp = state => {
    return {
        user: state.user,
        playlistBuild: state.playlistBuild,
        relatedArtists: state.relatedArtists,
        currentArtist: state.currentArtist
    }
}

const Discovery = ({user, playlistBuild, relatedArtists, currentArtist}) => {

    const renderArtistBubbles = () => {
        let results = [] 
        let j = 5
        for (let i = 0; i < j; i++) {
           let artist = relatedArtists.artists[i] 
           artist.images ?
           results.push(<ArtistBubble artist={artist} key={artist.id}/>) :
           j++
        }
        return results
    }

    return (
        <>
        <div className="discovery-tool">
            {relatedArtists.artists ? 
            <>
            <div className="artist-card">
                <ArtistCard/>
            </div>
            <div className="bubbles">
                {renderArtistBubbles()} 
            </div>
            </> :
            <h2>loading discovery tool</h2>
            }
        </div>
        </>
    )
}

export default connect(msp)(Discovery)