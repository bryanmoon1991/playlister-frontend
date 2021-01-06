import React from 'react';
import { connect } from 'react-redux';
import PlaylistBuilder from './PlaylistBuilder';
import '../Styles/BuildProfile.css';

const msp = (state) => {
  return {
    playlistBuild: state.playlistBuild,
  };
};

const BuildProfile = ({ playlistBuild }) => {
  return (
    <>
      <div className="profile">
        <div className="build">
          <PlaylistBuilder />
        </div>
        <div className="embedded">
          {playlistBuild.published ? (
            <iframe
              src={`https://open.spotify.com/embed/playlist/${playlistBuild.spotify_id}`}
              width="400"
              height="580"
              frameBorder="0"
              allowtransparency="true"
              allow="encrypted-media"
              title={playlistBuild.name}
            ></iframe>
          ) : undefined}
        </div>
      </div>
    </>
  );
};

export default connect(msp)(BuildProfile);
