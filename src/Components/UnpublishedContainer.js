import React from 'react'
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';

const msp = state => {
    return {
        user: state.user,
        playlists: state.playlists
    }
}

const UnpublishedContainer = ({user, playlists}) => {

    const renderBuilds = () => {
        return playlists.unPublished.map(playlist => {
            return (<li key={playlist.id}>
                <Link 
                to={`/users/${user.id}/playlists/${playlist.id}`}>
                {playlist.name}
                </Link>
                </li>)
        })
    }

    console.log("in unpublished", playlists)
    return (
        <div>
            {playlists.unPublished ? 
            renderBuilds() :
            <h3>loading playlists</h3>}
        </div>
    )
}


export default connect(msp)(UnpublishedContainer);