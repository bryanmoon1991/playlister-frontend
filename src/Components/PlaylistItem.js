import React from 'react'
import {connect} from 'react-redux';
import {removeSeed} from '../Redux/actions'

const msp = state => {
    return {
       playlistBuild: state.playlistBuild,
       playlistSeeds: state.playlistSeeds 
    }
}

const PlaylistItem = ({seed, removeSeed, playlistSeeds, playlistBuild}) => {
    console.log("test", playlistBuild, playlistSeeds)
    return (
        <span className="seed">
            <h3>{seed.name}</h3>
            <button onClick={() => removeSeed(seed, playlistBuild)}>X</button>
        </span>
    )
}

export default connect(msp, {removeSeed})(PlaylistItem);
