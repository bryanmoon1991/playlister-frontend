import React from 'react'
import { connect } from 'react-redux';
import ArtistBubble from './ArtistBubble';

const msp = state => {
    return {
        user: state.user,
        playlistBuild: state.playlistBuild,
        initialDiscovery: state.initialDiscovery,
        currentArtist: state.currentArtist
    }
}

const Discovery = ({user, playlistBuild, initialDiscovery, currentArtist}) => {

    const renderArtistBubbles = () => {
        let results = [] 
        let j = 5
        for (let i = 0; i < j; i++) {
           let artist = initialDiscovery.artists[i] 
           artist.images ?
           results.push(<ArtistBubble artist={artist} key={artist.id}/>) :
           j++
        }
        // return initialDiscovery.artists.map(artist => <h3>{artist.name}</h3>)
        return results
    }

    console.log("in Discovery - Artist", currentArtist)

    return (
        <>
        {initialDiscovery.artists ? 
        renderArtistBubbles() :
        <h2>loading discovery tool</h2>
        }
        </>
    )
}

export default connect(msp)(Discovery)