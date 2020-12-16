import React, {useEffect, useState} from 'react'
import { connect } from 'react-redux';
var Spotify = require('spotify-web-api-js');
var spotifyApi = new Spotify();


const msp = state => {
    return {
        user: state.user
    }
}

const ArtistBubble = ({artist, user}) => {
    spotifyApi.setAccessToken(user.access_token);
    let [track, setTrack] = useState(undefined)

    useEffect(() => {
       spotifyApi.getArtistTopTracks(artist.id, "US")
       .then(data => setTrack(new Audio(data.tracks[0].preview_url))) 
    }, [artist.id])

    const playPreview = () => {
        track.play();
    }

    const stopPreview = () => {
        track.pause();
        track.currentTime = 0
    }
    
    return (
      <img
        onMouseOver={() => playPreview()}
        onMouseOut={() => stopPreview()}
        className="bubble"
        alt="related-artist"
        src={artist.images[0].url}
        width="150"
        height="150"
      />
    );
}

export default connect(msp)(ArtistBubble);