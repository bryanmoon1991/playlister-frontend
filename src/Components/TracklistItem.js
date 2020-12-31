import React, { useState } from 'react';
import { Grid, Popup, Button } from 'semantic-ui-react';

const TracklistItem = ({ track, images, addSeed, addToBuildNotify }) => {
  let [preview, setPreview] = useState(new Audio(track.preview_url));

  const playPreview = () => {
    if (preview) {
      let playPromise = preview.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('playing');
          })
          .catch(() => {
            console.log('no preview available');
          });
      }
    } else {
      console.log('no preview for this artist');
    }
  };

  const stopPreview = () => {
    if (preview) {
      preview.pause();
      preview.currentTime = 0;
    }
  };

  return (
    <>
      <Popup
        size="mini"
        position="left center"
        hoverable
        hideOnScroll
        trigger={
          <h4
            onMouseEnter={() => playPreview()}
            onMouseLeave={() => stopPreview()}
            onWheel={() => stopPreview()}
          >
            {track.name}
          </h4>
        }
      >
        <Grid columns={1}>
          <Grid.Column textAlign="left">
            <Button.Group>
              <Popup
                mouseEnterDelay={500}
                position="bottom center"
                size="mini"
                content="favorite this track"
                trigger={<Button icon="like" size="mini" />}
              />
              <Popup
                mouseEnterDelay={500}
                position="bottom center"
                size="mini"
                content="open in spotify"
                trigger={<Button icon="spotify" size="mini" />}
              />
              <Popup
                mouseEnterDelay={500}
                position="bottom center"
                size="mini"
                content="add this track to playlist"
                trigger={
                  <Button
                    icon="add"
                    size="mini"
                    onClick={() => {
                      addSeed(track, images);
                      addToBuildNotify(track.name);
                    }}
                  />
                }
              />
            </Button.Group>
          </Grid.Column>
        </Grid>
      </Popup>
    </>
  );
};

export default TracklistItem;
