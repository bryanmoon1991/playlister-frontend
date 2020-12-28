import React, { useState } from 'react';
import { Grid, Popup, Header, Button } from 'semantic-ui-react';


const TopTrack = ({track, album, favoriteNotify}) => {
    
    let [preview, setPreview] = useState(new Audio(track.preview_url));
    let [info, setInfo] = useState({ album: album.name, title: track.name})


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
              src={album.images[album.images.length - 1].url}
              alt={album.name}
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
                  content="Favorite this Track"
                  trigger={
                    <Button
                      icon="like"
                      size="mini"
                      onClick={() => favoriteNotify(info.title)}
                    />
                  }
                />
                <Popup
                  mouseEnterDelay={500}
                  position="bottom center"
                  size="mini"
                  content={`Add ${info.title} to Playlist Build`}
                  trigger={<Button icon="add" size="mini" />}
                />
                <Popup
                  mouseEnterDelay={500}
                  position="bottom center"
                  size="mini"
                  content="Open in Spotify"
                  trigger={<Button icon="external" size="mini" />}
                />
              </Button.Group>
            </Grid.Column>
          </Grid>
        </Popup>
      </>
    );
}

export default TopTrack;