import React from 'react';
import { connect } from 'react-redux';
import { goBack } from '../Redux/actions';
import { Button, Popup } from 'semantic-ui-react';

const msp = (state) => {
  return {
    playlistBuild: state.playlistBuild,
  };
};

const Controls = ({ playlistBuild, goBack, spotifyApi }) => {
  console.log(playlistBuild.history);
  return (
    <>
      {playlistBuild.history ? (
        <>
          {playlistBuild.history.length > 1 ? (
            <Popup
              mouseEnterDelay={500}
              position="top center"
              size="mini"
              content={`Back to ${
                playlistBuild.history[playlistBuild.history.length - 2].name
              }`}
              trigger={
                <Button
                  className="controls"
                  circular
                  icon="step backward"
                  onClick={() =>
                    goBack(
                      playlistBuild.history[playlistBuild.history.length - 2],
                      spotifyApi
                    )
                  }
                />
              }
            />
          ) : undefined}
        </>
      ) : undefined}
    </>
  );
};

export default connect(msp, { goBack })(Controls);
