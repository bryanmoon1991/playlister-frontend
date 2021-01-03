import React, { useEffect, useState } from 'react';
import { Grid, Popup, Button, Header } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { createNext } from '../Redux/actions';
import '../Styles/ArtistBubble.css';

const ArtistBubble = ({
  artist,
  spotifyApi,
  createNext,
  followNotify,
  position,
}) => {
  let [preview, setPreview] = useState(undefined);
  let [info, setInfo] = useState({ name: '', title: '' });
  let [show, setShow] = useState(false);

  useEffect(() => {
    spotifyApi.getArtistTopTracks(artist.id, 'US').then((data) => {
      if (data.tracks[0]) {
        setPreview(new Audio(data.tracks[0].preview_url));
        setInfo({ name: artist.name, title: data.tracks[0].name });
      } else {
        setInfo({ name: artist.name, title: 'Sorry, there is no preview' });
      }
    });

    return () => {
      setPreview(undefined);
      setInfo({ name: '', title: '' });
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
        position={position % 2 ? 'right center' : 'left center'}
        hoverable
        hideOnScroll
        trigger={
          <div
            style={{
              backgroundImage: `url(${
                artist.images[0]
                  ? artist.images[0].url
                  : 'https://reactnativecode.com/wp-content/uploads/2018/02/Default_Image_Thumbnail.png'
              })`,
              backgroundSize: 'cover',
              height: '50px',
              width: '50px',
              borderRadius: '50%',
            }}
            onMouseEnter={() => playPreview()}
            onMouseLeave={() => stopPreview()}
            onWheel={() => stopPreview()}
            className="bubble"
            onClick={() => {
              createNext(artist, spotifyApi);
              stopPreview();
            }}
          />
        }
      >
        <Grid columns={1}>
          <Grid.Column textAlign="left">
            <Header as="h4">{`Artist: ${info.name}`}</Header>
            <p>{`Top Track: ${info.title}`}</p>
            <Button.Group>
              <Popup
                mouseEnterDelay={500}
                position="bottom center"
                size="mini"
                content={`Follow ${info.name} on Spotify`}
                trigger={
                  <Button
                    icon="user plus"
                    size="mini"
                    onClick={() => followNotify(info.name)}
                  />
                }
              />
              <Popup
                mouseEnterDelay={500}
                position="bottom center"
                size="mini"
                content="Open in Spotify"
                trigger={<Button icon="spotify" size="mini" />}
              />
            </Button.Group>
          </Grid.Column>
        </Grid>
      </Popup>
    </>
  );
};

export default connect(null, { createNext })(ArtistBubble);
