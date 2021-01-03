import React from 'react';
import { connect } from 'react-redux';
import ArtistBubble from './ArtistBubble';
import Card from './Card';
import '../Styles/Discovery.css';
import toast, { Toaster } from 'react-hot-toast';

const msp = (state) => {
  return {
    relatedArtists: state.relatedArtists,
  };
};

const Discovery = ({ relatedArtists, spotifyApi }) => {
  const favoriteNotify = (item) => toast(`Added ${item} to Favorites!`);
  const followNotify = (artist) => toast(`Now following ${artist} on Spotify`);
  const addToBuildNotify = (item) =>
    toast(`Added ${item} to Your Current Build!`);

  const renderArtistBubbles = () => {
    return relatedArtists.artists.map((artist, i) => (
      <ArtistBubble
        artist={artist}
        key={artist.id}
        spotifyApi={spotifyApi}
        followNotify={followNotify}
        position={i}
      />
    ));
  };

  return (
    <>
      <div className="discovery-tool">
        {relatedArtists.artists ? (
          <>
            <div className="stack">
              <Card
                spotifyApi={spotifyApi}
                followNotify={followNotify}
                favoriteNotify={favoriteNotify}
                addToBuildNotify={addToBuildNotify}
              />
            </div>
            <div className="bubbles">
              <p>Related Artists:</p>
              {renderArtistBubbles()}
            </div>
            <Toaster />
          </>
        ) : (
          <h2>loading discovery tool</h2>
        )}
      </div>
    </>
  );
};

export default connect(msp)(Discovery);
