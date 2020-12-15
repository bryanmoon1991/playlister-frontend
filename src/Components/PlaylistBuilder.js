import React from 'react'
import {connect} from 'react-redux'

const msp = state => {
    return {
        user: state.user,
        playlistBuild: state.playlistBuild
    }
}

const PlaylistBuilder = ({user, playlistBuild}) => {

    console.log("in playlistBuilder:", playlistBuild)
    return (
        <>
        {playlistBuild.name ? 
        <h3>{playlistBuild.name}</h3> :
        <h3>loading playlist builder</h3>
        }
        </>
    )
}

export default connect(msp)(PlaylistBuilder);