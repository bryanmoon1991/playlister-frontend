import { connect } from 'react-redux';
import { addSeed } from '../Redux/actions';
import ArtistCard from './ArtistCard';
import AlbumCard from './AlbumCard';

const msp = (state) => {
  return {
    currentSelection: state.currentSelection,
  };
};

const Card = ({ currentSelection, addSeed, spotifyApi }) => {
  const renderComponent = () => {
    switch (currentSelection.info.type) {
      case 'artist':
        return (
          <ArtistCard
            artist={currentSelection}
            addSeed={addSeed}
            spotifyApi={spotifyApi}
          />
        );
      case 'album':
        return (
          <AlbumCard
            album={currentSelection}
            addSeed={addSeed}
            spotifyApi={spotifyApi}
          />
        );
      default:
        console.log('no match');
    }
  };
  return (
    <>
      {currentSelection.info ? (
        renderComponent()
      ) : (
        <h3>Loading Discovery Tool</h3>
      )}
    </>
  );
};

export default connect(msp, { addSeed })(Card);
