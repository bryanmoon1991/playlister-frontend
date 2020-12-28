import React, {useEffect, useState} from 'react';
import { Grid, Popup, Header, Button } from 'semantic-ui-react';
import {createNext} from '../Redux/actions';
import { connect } from 'react-redux'

const Preview = ({album, spotifyApi, createNext}) => {

    let [preview, setPreview] = useState(undefined);
    let [info, setInfo] = useState({ album: "", title: ""})

    useEffect(() => {
      spotifyApi.getAlbumTracks(album.id, 'US').then((data) => {
        for (let i = 0; i < data.items.length; i++) {
            let random = Math.floor(Math.random() * Math.floor(data.items.length));
            if (data.items[random].preview_url) {
                setPreview(new Audio(data.items[random].preview_url));
                setInfo({album: album.name, title: data.items[random].name})
                break;
            }
        }
      });
      
      return () => {
        setPreview(undefined);
        setInfo({ album: "", title: "" })
      };
    }, [spotifyApi]);

    const playPreview = () => {
      preview ? preview.play() : console.log('no preview for this artist');
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
            <img
              src={album.images[album.images.length - 1].url}
              alt={album.name}
              onMouseOver={() => playPreview()}
              onMouseOut={() => stopPreview()}
              onClick={() => {
                createNext(album, spotifyApi)
                stopPreview()
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
                  content="favorite this album"
                  trigger={<Button icon="like" size="mini" />}
                />
                <Popup
                  mouseEnterDelay={500}
                  position="bottom center"
                  size="mini"
                  content="open in spotify"
                  trigger={<Button icon="external" size="mini" />}
                />
              </Button.Group>
            </Grid.Column>
          </Grid>
        </Popup>
      </>
    );
}

export default connect(null, {createNext})(Preview);