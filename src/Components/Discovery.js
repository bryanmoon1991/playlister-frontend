import React from 'react'
import { connect } from 'react-redux';

const msp = state => {
    return {
        user: state.user,
        playlistBuild: state.playlistBuild,
        initialDiscovery: state.initialDiscovery
    }
}

const Discovery = ({user, playlistBuild, initialDiscovery}) => {

    const renderArtists = () => {
        initialDiscovery.artists.map(artist => <h3>{artist.name}</h3>)
    }

    return (
        <>
        {initialDiscovery.artists ? 
        renderArtists() :
        <h2>loading discovery tool</h2>
        }
        </>
    )
}

export default connect(msp)(Discovery)