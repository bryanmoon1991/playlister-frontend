import React from 'react'
import { connect } from 'react-redux';
import ArtistBubble from './ArtistBubble';
import ArtistCard from './ArtistCard'

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
        {relatedArtists.artists ? 
        <>
        <ArtistCard/>
        {renderArtistBubbles()} 
        </> :
        <h2>loading discovery tool</h2>
        }
        </>
    )
}

export default connect(msp)(Discovery)