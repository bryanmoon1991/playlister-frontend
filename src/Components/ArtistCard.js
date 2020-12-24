import React from 'react'
import Preview from './Preview';
import '../Styles/ArtistCard.css'

const ArtistCard = ({artist, addSeed, spotifyApi}) => {
    console.log("artist card", artist)

    const renderGenres = () => {
        return artist.info.genres.join(", ")
    }

    const renderAlbums = () => {
        let albums = []
        let singles = []
        let appearsOn = []
        artist.albums.forEach(album => {
            switch (album.album_group) {
                case "album":
                    albums.push(<Preview key={album.id} album={album} spotifyApi={spotifyApi}/>)
                    break;
                case "single":
                    singles.push(<Preview key={album.id} album={album} spotifyApi={spotifyApi}/>)
                    break;
                case "appears_on":
                    appearsOn.push(<Preview key={album.id} album={album} spotifyApi={spotifyApi}/>)
                    break;
                default:
                    console.log(`no match for ${album.album_group}`)
            } 
        })

        return (
            <>
            {albums.length ? (
                <div className="albums">
                    <p>albums:</p>
                    {albums}
                </div>
            ) : undefined}
            {singles.length ? (
                <div className="singles">
                    <p>singles:</p>
                    {singles}
                </div>
            ) : undefined}
            {appearsOn.length ? (
                <div className="appears-on">
                    <p>appears on:</p>
                    {appearsOn}
                </div>
            ) : undefined}
            </>
        )
    }

    
    return (
        <>
        {artist.info ? 
            <div className='artist-card'>
                <img 
                src={artist.info.images[0].url}
                alt="artist"
                className="artist-picture"
                />
                <button onClick={() => addSeed(artist.info)}>
                    Add
                </button>
                <div className="info">
                    <h3>{artist.info.name}</h3>
                    <h4>Followers: {artist.info.followers.total}</h4>
                    <p>{renderGenres()}</p>
                </div>
                <div className="artist-works">
                    {renderAlbums()}
                </div>
            </div>
        :
            <h3>Loading Discovery Tool</h3>
        }
        </>
    )
}

export default ArtistCard