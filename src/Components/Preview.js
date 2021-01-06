import React, { useEffect, useState } from 'react';
import { Grid, Popup, Header, Button } from 'semantic-ui-react';
import { createNext } from '../Redux/actions';
import { connect } from 'react-redux';

const Preview = ({
  album,
  spotifyApi,
  createNext,
  saveNotify,
  unsaveNotify,
}) => {
  let [preview, setPreview] = useState(undefined);
  let [info, setInfo] = useState({ album: '', title: '' });

  useEffect(() => {
    for (let i = 0; i < album.tracks.items.length; i++) {
      let random = Math.floor(
        Math.random() * Math.floor(album.tracks.items.length)
      );
      if (album.tracks.items[random].preview_url) {
        setPreview(new Audio(album.tracks.items[random].preview_url));
        setInfo({ album: album.name, title: album.tracks.items[random].name });
        break;
      }
    }

    return () => {
      setPreview(undefined);
      setInfo({ album: '', title: '' });
    };
  }, [spotifyApi]);

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
            style={
              album.album_group === 'appears_on' ||
              album.album_group === 'compilation'
                ? {
                    backgroundImage: `url(${
                      album.images[album.images.length - 1].url
                    })`,
                    backgroundSize: 'cover',
                    height: '32px',
                    width: '32px',
                  }
                : {
                    backgroundImage: `url(${
                      album.images[album.images.length - 1].url
                    })`,
                    backgroundSize: 'cover',
                    height: '64px',
                    width: '64px',
                  }
            }
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
            <p>{`Preview Track: ${info.title}`}</p>
            <Button.Group>
              <Popup
                mouseEnterDelay={500}
                position="bottom center"
                size="mini"
                content={album.saved ? 'remove from saved' : 'save this album'}
                trigger={
                  album.saved ? (
                    <Button
                      icon="undo"
                      size="mini"
                      onClick={() => {
                        unsaveNotify(album.name);
                        spotifyApi.removeFromMySavedAlbums([album.id]);
                      }}
                    />
                  ) : (
                    <Button
                      icon="save"
                      size="mini"
                      onClick={() => {
                        saveNotify(album.name);
                        spotifyApi.addToMySavedAlbums([album.id]);
                      }}
                    />
                  )
                }
              />
              <Popup
                mouseEnterDelay={500}
                position="bottom center"
                size="mini"
                content="open in spotify"
                trigger={
                  <Button
                    as="a"
                    target="_blank"
                    href={album.external_urls.spotify}
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

export default connect(null, { createNext })(Preview);
