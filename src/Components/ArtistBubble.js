import React, {useEffect, useState} from 'react'
import {connect} from 'react-redux';
import {createNext} from '../Redux/actions';

const ArtistBubble = ({artist, spotifyApi, createNext}) => {
    let [track, setTrack] = useState(undefined)

    useEffect(() => {
        spotifyApi.getArtistTopTracks(artist.id, "US")
        .then(data => setTrack(new Audio(data.tracks[0].preview_url))) 
        
        return () => {
            setTrack(undefined)
        }
    }, [artist.id, spotifyApi])

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
        onClick={() => {
            createNext(artist, spotifyApi)
            stopPreview()
        }}
      />
    );
}

export default connect(null, {createNext})(ArtistBubble);