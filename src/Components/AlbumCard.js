import React from 'react';
import { connect } from 'react-redux';
import { createNext } from '../Redux/actions';
import ArtistBubble from './ArtistBubble';
import TracklistItem from './TracklistItem';
import { Popup, Button } from 'semantic-ui-react';

const AlbumCard = ({
  album,
  addSeed,
  spotifyApi,
  createNext,
  followNotify,
  favoriteNotify,
  addToBuildNotify,
}) => {
  console.log('in album card', album);

  const renderFeatures = () => {
    // debugger;
    return album.features.map((artist) => (
      <ArtistBubble
        key={artist.id}
        artist={artist}
        spotifyApi={spotifyApi}
        createNext={createNext}
      />
    ));
  };

  const renderTracks = () => {
    return album.info.tracks.items.map((track) => (
      <TracklistItem
        key={track.id}
        track={track}
        addToBuildNotify={addToBuildNotify}
        addSeed={addSeed}
      />
    ));
  };

  return (
    <>
      {album.info ? (
        <div className="album-card">
          <img
            src={album.info.images[1].url}
            alt="album"
            className="album-picture"
          />
          <div className="info">
            <h3>{album.info.name + ' by ' + album.info.artists[0].name}</h3>
            <Button.Group>
              <Popup
                mouseEnterDelay={500}
                position="bottom center"
                size="mini"
                content={`Follow ${album.info.artists[0].name} on Spotify`}
                trigger={
                  <Button
                    icon="user plus"
                    size="mini"
                    onClick={() => followNotify(album.info.artists[0].name)}
                  />
                }
              />
              <Popup
                mouseEnterDelay={500}
                position="bottom center"
                size="mini"
                content={`Add ${album.info.name} to Playlist Build`}
                trigger={
                  <Button
                    icon="add"
                    size="mini"
                    onClick={() => {
                      addToBuildNotify(album.info.name);
                      addSeed(album.info);
                    }}
                  />
                }
              />
              <Popup
                mouseEnterDelay={500}
                position="bottom center"
                size="mini"
                content={`Add ${album.info.name} to Favorites`}
                trigger={
                  <Button
                    icon="heart"
                    size="mini"
                    onClick={() => favoriteNotify(album.info.name)}
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
            <p>Artists on this album:</p>
            {renderFeatures()}
            <p>Tracklist:</p>
            {renderTracks()}
          </div>
        </div>
      ) : (
        <h3>Loading Discovery Tool</h3>
      )}
    </>
  );
};

export default connect(null, { createNext })(AlbumCard);
