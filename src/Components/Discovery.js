import { useEffect } from 'react';
import { connect } from 'react-redux';
import { Loader } from 'semantic-ui-react';
import ArtistBubble from './ArtistBubble';
import Card from './Card';
import Controls from './Controls';
import '../Styles/Discovery.css';
import { Toaster } from 'react-hot-toast';

const msp = (state) => {
  return {
    relatedArtists: state.relatedArtists,
  };
};

const Discovery = ({ relatedArtists, spotifyApi }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const renderArtistBubbles = () => {
    return relatedArtists.artists.map((artist, i) => (
      <ArtistBubble
        artist={artist}
        key={artist.id}
        spotifyApi={spotifyApi}
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
              <Card spotifyApi={spotifyApi} />
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
