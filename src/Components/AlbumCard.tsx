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
} from './utils';

import { Album } from '../types/index';

interface Props {
  album: Album;
  addSeed: Function;
  spotifyApi: any;
  createNext: Function;
}

const AlbumCard = ({ album, addSeed, spotifyApi, createNext }: Props) => {
  const { info, features, tracks } = album;

  const renderFeatures = () => {
    if (info.artists[0].name === 'Various Artists') {
      return <p>See Related Artists:</p>;
    } else {
      return features.map((artist) => (
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
    // return album.info.tracks.items.map((track) => (
    return tracks.map((track) => (
      <TracklistItem
        //why is the key erroring out?
        // key={track.id}
        track={track}
        images={info.images}
        addToBuildNotify={addToBuildNotify}
        addSeed={addSeed}
      />
    ));
  };

  //should i desctructure info further?

  return (
    <>
      {info ? (
        <div className="album-card">
          <img src={info.images[1].url} alt="album" className="album-picture" />
          <div className="info">
            <h3>{info.name + ' by ' + info.artists[0].name}</h3>
            <Button.Group>
              <Popup
                mouseEnterDelay={500}
                position="bottom center"
                size="mini"
                content={
                  info.saved
                    ? `Remove ${info.name} from Saved`
                    : `Add ${info.name} to Favorites`
                }
                trigger={
                  info.saved ? (
                    <Button
                      icon="undo"
                      size="mini"
                      onClick={() => {
                        spotifyApi.removeFromMySavedAlbums([info.id]);
                        unsaveNotify(info.name);
                      }}
                    />
                  ) : (
                    <Button
                      icon="save"
                      size="mini"
                      onClick={() => {
                        spotifyApi.addToMySavedAlbums([info.id]);
                        saveNotify(info.name);
                      }}
                    />
                  )
                }
              />
              <Popup
                mouseEnterDelay={500}
                position="bottom center"
                size="mini"
                content={`Add ${info.name} to Playlist Build`}
                trigger={
                  <Button
                    icon="add"
                    size="mini"
                    onClick={() => {
                      addToBuildNotify(info.name);
                      addSeed(info);
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
                    href={info.external_urls.spotify}
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
