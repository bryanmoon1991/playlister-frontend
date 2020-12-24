import React, {useEffect, useState} from 'react'
import {connect} from 'react-redux';
import {createNext} from '../Redux/actions';

const ArtistBubble = ({artist, spotifyApi, createNext}) => {
    let [track, setTrack] = useState(undefined)

    useEffect(() => {
        spotifyApi.getArtistTopTracks(artist.id, "US")
        .then(data => {
            if (data.tracks[0]) {
                setTrack(new Audio(data.tracks[0].preview_url)) 
            }
        })
        
        return () => {
            setTrack(undefined)
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
      <img
        onMouseOver={() => playPreview()}
        onMouseOut={() => stopPreview()}
        className="bubble"
        alt="related-artist"
        src={artist.images[0].url}
        width="50"
        height="50"
        onClick={() => {
            createNext(artist, spotifyApi)
            stopPreview()
        }}
      />
    );
}

export default connect(null, {createNext})(ArtistBubble);