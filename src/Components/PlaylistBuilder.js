import React from 'react'
import {connect} from 'react-redux'
import PlaylistItem from './PlaylistItem'

const msp = state => {
    return {
        user: state.user,
        playlistBuild: state.playlistBuild,
        playlistSeeds: state.playlistSeeds
    }
}

const PlaylistBuilder = ({user, playlistBuild, playlistSeeds}) => {


    console.log("in playlistBuilder:", playlistBuild, playlistSeeds)

    const renderSeeds = () => {
        return playlistSeeds.map(seed => <PlaylistItem seed={seed}/>)
    }


    return (
        <>
            <div className="builder">
                {playlistBuild.name ? 
                    <>
                    <h3>{playlistBuild.name}</h3> 
                    {renderSeeds()}
                    </>
                    :
                    <h3>loading playlist builder</h3>
                }
            </div>
        </>
    )
}

export default connect(msp)(PlaylistBuilder);