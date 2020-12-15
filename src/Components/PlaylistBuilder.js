import React from 'react'
import {connect} from 'react-redux'

const msp = state => {
    return {
        playlistBuild: state.playlistBuild
    }
}

const PlaylistBuilder = ({playlistBuild}) => {

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