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
    return playlists.unPublished.map((playlist) => {
      return (
        <>
          <li key={playlist.id}>
            <Link
              key={playlist.id}
              to={`/users/${user.id}/playlists/${playlist.id}`}
            >
              {playlist.name}
            </Link>
          </li>
        </>
      );
    });
  };

  return (
    <div>
      {playlists.unPublished ? renderBuilds() : <h3>loading playlists</h3>}
    </div>
  );
};

export default connect(msp)(UnpublishedContainer);