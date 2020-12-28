import React from 'react'
import Preview from './Preview';
import TopTrack from './Track';
import '../Styles/ArtistCard.css'
import { Popup, Button } from 'semantic-ui-react';


const ArtistCard = ({artist, addSeed, spotifyApi, followNotify, favoriteNotify}) => {
    console.log("artist card", artist)
    
    const renderGenres = () => {
        return artist.info.genres.join(", ")
    }

    const renderAlbums = () => {
        let tracks = []
        let albums = []
        let singles = []
        let appearsOn = []

        artist.tracks.forEach(track => {
            tracks.push(
                <TopTrack
                key={track.id}
                track={track}
                album={track.album}
                favoriteNotify={favoriteNotify}
                />
            ); 
        })
        
        artist.albums.forEach(album => {
            switch (album.album_group) {
                case "album":
                    albums.push(
                      <Preview
                        key={album.id}
                        album={album}
                        spotifyApi={spotifyApi}
                      />
                    );
                    break;
                case "single":
                    singles.push(
                      <Preview
                        key={album.id}
                        album={album}
                        spotifyApi={spotifyApi}
                        
                      />
                    );
                    break;
                case "appears_on":
                    appearsOn.push(
                      <Preview
                        key={album.id}
                        album={album}
                        spotifyApi={spotifyApi}
                        
                      />
                    );
                    break;
                default:
                    console.log(`no match for ${album.album_group}`)
            } 
        })

        return (
            <>
            {tracks.length ? (
                <div className="top-tracks">
                    <p>top tracks:</p>
                    {tracks}
                </div>
            ) : undefined }
            {albums.length ? (
                <div className="albums">
                    <p>albums:</p>
                    {albums}
                </div>
            ) : undefined }
            {singles.length ? (
                <div className="singles">
                    <p>singles:</p>
                    {singles}
                </div>
            ) : undefined }
            {appearsOn.length ? (
                <div className="appears-on">
                    <p>appears on:</p>
                    {appearsOn}
                </div>
            ) : undefined }
            </>
        )
    }

    
    return (
      <>
        {artist.info ? (
          <div className="artist-card">
            <img
              src={artist.info.images[0].url}
              alt="artist"
              className="artist-picture"
            />
            <div className="info">
              <h3>{artist.info.name}</h3>
              <Button.Group>
                <Popup
                  mouseEnterDelay={500}
                  position="bottom center"
                  size="mini"
                  content={`Follow ${artist.info.name} on Spotify`}
                  trigger={
                    <Button
                      icon="user plus"
                      size="mini"
                      onClick={() => followNotify(artist.info.name)}
                    />
                  }
                />
                <Popup
                  mouseEnterDelay={500}
                  position="bottom center"
                  size="mini"
                  content={`Add ${artist.info.name} to Playlist Build`}
                  trigger={
                    <Button
                      icon="add"
                      size="mini"
                      onClick={() => addSeed(artist.info)}
                    />
                  }
                />
                <Popup
                  mouseEnterDelay={500}
                  position="bottom center"
                  size="mini"
                  content={`Add ${artist.info.name} to Favorites`}
                  trigger={
                    <Button
                      icon="heart"
                      size="mini"
                      onClick={() => favoriteNotify(artist.info.name)}
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
              <h4>Followers: {artist.info.followers.total}</h4>
              <p>{renderGenres()}</p>
            </div>
            <div className="artist-works">{renderAlbums()}</div>
          </div>
        ) : (
          <h3>Loading Discovery Tool</h3>
        )}
      </>
    );
}

export default ArtistCard