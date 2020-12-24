import React from 'react'
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';

const msp = (state) => {
  return {
    user: state.user,
    playlists: state.playlists,
  };
};

const UnpublishedContainer = ({ user, playlists }) => {

  const renderBuilds = () => {
    return playlists.map((playlist) => (
      <Link key={playlist.id} to={`/users/${user.id}/playlists/${playlist.id}`}>
        {playlist.name}
      </Link>
    ));
  };

  return (
    <div>
      {playlists[0] ? renderBuilds() : <h3>loading playlists</h3>}
    </div>
  );
};

export default connect(msp)(UnpublishedContainer);