import React, {useEffect, useState} from 'react';
import { Grid, Popup, Button, Header } from 'semantic-ui-react';
import {connect} from 'react-redux';
import {createNext} from '../Redux/actions';

const ArtistBubble = ({artist, spotifyApi, createNext, followNotify}) => {
    let [track, setTrack] = useState(undefined)
    let [info, setInfo] = useState({ name: "", title: "" })

    useEffect(() => {
        spotifyApi.getArtistTopTracks(artist.id, "US")
        .then(data => {
          if (data.tracks[0]) {
            setTrack(new Audio(data.tracks[0].preview_url)) 
            setInfo({ name: artist.name, title: data.tracks[0].name} )
          } else {
            setInfo({ name: artist.name, title: "Sorry, there is no preview" })
          }
        })
        
        return () => {
          setTrack(undefined)
          setInfo({ name: "", title: "" })
        }
    }, [spotifyApi])

    const playPreview = () => {
      track ? track.play() : console.log("no preview for this artist")
    }

    const stopPreview = () => {
      if (track) {
        track.pause()
        track.currentTime = 0
      }
    }
    
    return (
      <>
        <Popup
          size="mini"
          position="left center"
          hoverable
          hideOnScroll
          trigger={
            <img
              onMouseOver={() => playPreview()}
              onMouseOut={() => stopPreview()}
              className="bubble"
              alt="related-artist"
              //   sometimes causes an issue
              src={artist.images[0].url}
              width="50"
              height="50"
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
                  trigger={<Button icon="external" size="mini" />}
                />
              </Button.Group>
            </Grid.Column>
          </Grid>
        </Popup>
      </>
    );
}


export default connect(null, {createNext})(ArtistBubble);