import React from 'react'


const ArtistBubble = ({artist}) => {
    return (
        <img className="bubble" src={artist.images[0].url} width='150' height='150'/>
    )
}

export default ArtistBubble;