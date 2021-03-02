import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Loader } from 'semantic-ui-react';
import ArtistBubble from './ArtistBubble';
import Card from './Card';
import Controls from './Controls';
import '../Styles/Discovery.css';
import toast, { Toaster } from 'react-hot-toast';

const msp = (state) => {
  return {
    relatedArtists: state.relatedArtists,
  };
};

const Discovery = ({ relatedArtists, spotifyApi }) => {
  const saveNotify = (item) => toast(`Saved ${item} on Spotify`);
  const unsaveNotify = (item) => toast(`Removed ${item} from Saved`);
  const followNotify = (artist) => toast(`Now following ${artist} on Spotify`);
  const unfollowNotify = (artist) => toast(`Unfollowed ${artist} on Spotify`);
  const addToBuildNotify = (item) =>
    toast(`Added ${item} to Your Current Build!`);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const renderArtistBubbles = () => {
    return relatedArtists.artists.map((artist, i) => (
      <ArtistBubble
        artist={artist}
        key={artist.id}
        spotifyApi={spotifyApi}
        followNotify={followNotify}
        unfollowNotify={unfollowNotify}
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
              <Controls spotifyApi={spotifyApi} />
              <Card
                spotifyApi={spotifyApi}
                followNotify={followNotify}
                unfollowNotify={unfollowNotify}
                saveNotify={saveNotify}
                unsaveNotify={unsaveNotify}
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
          <Loader active inline="centered" />
        )}
      </div>
    </>
  );
};

export default connect(msp)(Discovery);
