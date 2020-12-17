import React from 'react'
import {connect} from 'react-redux';
import {removeSeed} from '../Redux/actions'

// const msp = state => {
//     return {
//        playlistBuild: state.playlistBuild,
//     }
// }

const PlaylistItem = ({seed, removeSeed, playlistId}) => {
    // console.log("test", playlistBuild)
    return (
        <span className="seed">
            <h3>{seed.name}</h3>
            <button onClick={() => removeSeed(seed, playlistId)}>X</button>
        </span>
    )
}

export default connect(null, {removeSeed})(PlaylistItem);
