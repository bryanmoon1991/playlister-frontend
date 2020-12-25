import React, { useState } from 'react';
import { Grid, Popup, Header, Button } from 'semantic-ui-react';


const Track = ({track}) => {
    
    let [preview, setPreview] = useState(new Audio(track.preview_url));
    let [info, setInfo] = useState({ album: track.album.name, title: track.name})


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
            onMouseOver={() => playPreview()}
            onMouseOut={() => stopPreview()}
            src={track.album.images[track.album.images.length - 1].url}
            alt={track.album.name}
            />
        }
        >
        <Grid columns={1}>
            <Grid.Column textAlign="left">
            <Header as="h4">{`Off the Album: ${info.album}`}</Header>
            <p>{`Track: ${info.title}`}</p>
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
                trigger={<Button icon="external" size="mini" />}
                />
            </Button.Group>
            </Grid.Column>
        </Grid>
        </Popup>
    </>
    );
}

export default Track;