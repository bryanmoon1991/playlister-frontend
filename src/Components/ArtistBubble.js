import React, {useEffect, useState} from 'react'
import { connect } from 'react-redux';
// var Spotify = require('spotify-web-api-js');
// var spotifyApi = new Spotify();
// spotifyApi.setAccessToken(user.access_token)

const msp = state => {
    return {
        user: state.user,
    }
}

const ArtistBubble = ({user, artist, spotifyApi}) => {
    let [track, setTrack] = useState(undefined)

    useEffect(() => {
        spotifyApi.getArtistTopTracks(artist.id, "US")
        .then(data => setTrack(new Audio(data.tracks[0].preview_url))) 
    }, [artist.id])

    const playPreview = () => {
        track ? track.play() : console.log("first render")
    }

    const stopPreview = () => {
        if (track) {
            track.pause()
            track.currentTime = 0
        }
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