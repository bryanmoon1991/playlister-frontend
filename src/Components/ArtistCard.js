import React from 'react';
import Preview from './Preview';
import TopTrack from './TopTrack';
import '../Styles/ArtistCard.css';
import { Popup, Button } from 'semantic-ui-react';
import {
  saveNotify,
  unsaveNotify,
  followNotify,
  unfollowNotify,
  addToBuildNotify,
} from './utils';

const ArtistCard = ({ artist, addSeed, spotifyApi }) => {
  const renderGenres = () => {
    return artist.info.genres.join(', ');
  };

  const renderAlbums = () => {
    let tracks = [];
    let albums = [];
    let singles = [];
    let compilation = [];
    let appears = [];

    artist.tracks.forEach((track) => {
      tracks.push(
        <TopTrack
          key={track.id}
          track={track}
          album={track.album}
          spotifyApi={spotifyApi}
          addSeed={addSeed}
        />,
      );
    });

    artist.albums.forEach((album) => {
      switch (album.album_group) {
        case 'album':
          albums.push(
            <Preview key={album.id} album={album} spotifyApi={spotifyApi} />,
          );
          break;
        case 'single':
          singles.push(
            <Preview key={album.id} album={album} spotifyApi={spotifyApi} />,
          );
          break;
        case 'compilation':
          compilation.push(
            <Preview key={album.id} album={album} spotifyApi={spotifyApi} />,
          );
          break;
        case 'appears_on':
          appears.push(
            <Preview key={album.id} album={album} spotifyApi={spotifyApi} />,
          );
          break;
        default:
          console.log(`no match for ${album.album_group}`);
      }
    });

    return (
      <>
        {tracks.length ? (
          <div>
            <strong>top tracks:</strong>
            <div className="top-tracks">{tracks}</div>
          </div>
        ) : undefined}
        {albums.length ? (
          <div>
            <strong>albums:</strong>
            <div className="albums">{albums}</div>
          </div>
        ) : undefined}
        {singles.length ? (
          <div>
            <strong>singles:</strong>
            <div className="singles">{singles}</div>
          </div>
        ) : undefined}
        {appears.length ? (
          <div>
            <strong>appears on:</strong>
            <div className="appears">{appears}</div>
          </div>
        ) : undefined}
        {compilation.length ? (
          <div>
            <strong>compilations:</strong>
            <div className="compilations">{compilation}</div>
          </div>
        ) : undefined}
      </>
    );
  };

  return (
    <>
      {artist.info ? (
        <div className="artist-card">
          <img
            src={
              artist.info.images[0]
                ? artist.info.images[0].url
                : 'https://reactnativecode.com/wp-content/uploads/2018/02/Default_Image_Thumbnail.png'
            }
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
                  artist.info.following ? (
                    <Button
                      icon="user times"
                      size="mini"
                      onClick={() => {
                        spotifyApi.unfollowArtists([artist.info.id]);
                        unfollowNotify(artist.info.name);
                      }}
                    />
                  ) : (
                    <Button
                      icon="user plus"
                      size="mini"
                      onClick={() => {
                        spotifyApi.followArtists([artist.info.id]);
                        followNotify(artist.info.name);
                      }}
                    />
                  )
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
                    onClick={() => {
                      addToBuildNotify(artist.info.name);
                      addSeed(artist.info);
                    }}
                  />
                }
              />
              <Popup
                mouseEnterDelay={500}
                position="bottom center"
                size="mini"
                content="Open in Spotify"
                trigger={
                  <Button
                    as="a"
                    target="_blank"
                    href={artist.info.external_urls.spotify}
                    icon="spotify"
                    size="mini"
                  />
                }
              />
            </Button.Group>
            <h4>Followers: {artist.info.followers.total}</h4>
            <p>{renderGenres()}</p>
            <br />
          </div>
          <div className="artist-works">{renderAlbums()}</div>
        </div>
      ) : (
        <h3>Loading Discovery Tool</h3>
      )}
    </>
  );
};

export default ArtistCard;
