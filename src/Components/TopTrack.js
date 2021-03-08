import { useState } from 'react';
import { Grid, Popup, Header, Button } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { createNext } from '../Redux/actions';

import { saveNotify, unsaveNotify, addToBuildNotify } from './utils';

const TopTrack = ({ track, album, addSeed, createNext, spotifyApi }) => {
  let [preview, setPreview] = useState(new Audio(track.preview_url));
  let [info, setInfo] = useState({ album: album.name, title: track.name });

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
        hoverable
        hideOnScroll
        trigger={
          <div
            style={{
              backgroundImage: `url(${
                album.images[album.images.length - 1].url
              })`,
              backgroundSize: 'cover',
              height: '64px',
              width: '64px',
            }}
            onMouseEnter={() => playPreview()}
            onMouseLeave={() => stopPreview()}
            onWheel={() => stopPreview()}
            className="album-preview"
            onClick={() => {
              createNext(album, spotifyApi);
              stopPreview();
            }}
          />
        }
      >
        <Grid columns={1}>
          <Grid.Column textAlign="left">
            <Header as="h4">{`Album: ${info.album}`}</Header>
            <p>{`Track: ${info.title}`}</p>
            <Button.Group>
              <Popup
                mouseEnterDelay={500}
                position="bottom center"
                size="mini"
                content={track.saved ? 'Remove from Saved' : 'Save this Track'}
                trigger={
                  track.saved ? (
                    <Button
                      icon="undo"
                      size="mini"
                      onClick={() => {
                        unsaveNotify(track.name);
                        spotifyApi.removeFromMySavedTracks([track.id]);
                      }}
                    />
                  ) : (
                    <Button
                      icon="save"
                      size="mini"
                      onClick={() => {
                        saveNotify(track.name);
                        spotifyApi.addToMySavedTracks([track.id]);
                      }}
                    />
                  )
                }
              />
              <Popup
                mouseEnterDelay={500}
                position="bottom center"
                size="mini"
                content={`Add ${info.title} to Playlist Build`}
                trigger={
                  <Button
                    icon="add"
                    size="mini"
                    onClick={() => {
                      addToBuildNotify(info.title);
                      addSeed(track, album.images);
                    }}
                  />
                }
              />
              <Popup
                mouseEnterDelay={500}
                position="bottom center"
                size="mini"
                content="Open in Spotify"
                trigger={
                  <Button
                    as="a"
                    target="_blank"
                    href={track.external_urls.spotify}
                    icon="spotify"
                    size="mini"
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

export default connect(null, { createNext })(TopTrack);
