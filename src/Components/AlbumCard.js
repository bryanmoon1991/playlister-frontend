import React from 'react';
import { connect } from 'react-redux';
import { createNext } from '../Redux/actions';
import ArtistBubble from './ArtistBubble';
import TracklistItem from './TracklistItem';
import { Popup, Button } from 'semantic-ui-react';
import '../Styles/AlbumCard.css';
import {
  saveNotify,
  unsaveNotify,
  followNotify,
  unfollowNotify,
  addToBuildNotify,
} from './utils'

const AlbumCard = ({
  album,
  addSeed,
  spotifyApi,
  createNext,
}) => {
  console.log('in album card', album);

  const renderFeatures = () => {
    // debugger;
    if (album.info.artists[0].name === 'Various Artists') {
      return <p>See Related Artists:</p>;
    } else {
      return album.features.map((artist) => (
        <ArtistBubble
          key={artist.id}
          artist={artist}
          spotifyApi={spotifyApi}
          createNext={createNext}
          followNotify={followNotify}
          unfollowNotify={unfollowNotify}
        />
      ));
    }
  };

  const renderTracks = () => {
    return album.info.tracks.items.map((track) => (
      <TracklistItem
        key={track.id}
        track={track}
        images={album.info.images}
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
                content={
                  album.info.saved
                    ? `Remove ${album.info.name} from Saved`
                    : `Add ${album.info.name} to Favorites`
                }
                trigger={
                  album.info.saved ? (
                    <Button
                      icon="undo"
                      size="mini"
                      onClick={() => {
                        spotifyApi.removeFromMySavedAlbums([album.info.id]);
                        unsaveNotify(album.info.name);
                      }}
                    />
                  ) : (
                    <Button
                      icon="save"
                      size="mini"
                      onClick={() => {
                        spotifyApi.addToMySavedAlbums([album.info.id]);
                        saveNotify(album.info.name);
                      }}
                    />
                  )
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
                content="Open in Spotify"
                trigger={
                  <Button
                    as="a"
                    target="_blank"
                    href={album.info.external_urls.spotify}
                    icon="spotify"
                    size="mini"
                  />
                }
              />
            </Button.Group>
            <p>Artists on this album:</p>
            <div className="features">{renderFeatures()}</div>
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
