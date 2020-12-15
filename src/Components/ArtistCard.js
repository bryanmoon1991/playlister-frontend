import React from 'react'

const ArtistCard = ({artist}) => {
    return (
        <div className='artist'>
            <h3>{artist.name}</h3>
            <img src={artist.images[0].url}/>
        </div>
    )
}

export default ArtistCard;