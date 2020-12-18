import React, {useState, useEffect} from 'react';
import { connect } from 'react-redux';
import PlaylistItem from './PlaylistItem';
import {updatePlaylist, loadBuild} from '../Redux/actions'

const msp = (state) => {
  return {
    playlistBuild: state.playlistBuild,
    spotifyApi: state.spotifyApi
  };
};

const PlaylistBuilder = ({match, playlistBuild, updatePlaylist, loadBuild}) => {
  let [{ name }, setName] = useState({ name: playlistBuild.name });
  let [titleEdit, setTitleEdit] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setName((prevState) => ({ ...prevState, [name]: value }));
  };

  const keyPress = (e) => {
    if (e.key === 'Enter') {
      updatePlaylist(playlistBuild.id, 'name', name);
      setTitleEdit(!titleEdit);
    }
  };

  // if the user navigates to the builder from the playlists we'll use match
  // if not, the playlistBuild and playlistSeeds will be set from start new action
  console.log("in builder", playlistBuild)
  useEffect(() => {
    if (match) {
      loadBuild(match.params.id)
      }
  },[])


  const renderSeeds = () => {
    return playlistBuild.items.map((seed) => (
      <PlaylistItem key={seed.id} seed={seed} playlistId={playlistBuild.id} />
    ));
  };

  return (
    <>
      <div className="builder">
        {playlistBuild.name ? (
          <>
            {titleEdit ? (
              <input
                value={name}
                name="name"
                onChange={handleChange}
                onKeyDown={keyPress}
              ></input>
            ) : (
              <h3 onClick={() => setTitleEdit(!titleEdit)}>
                {playlistBuild.name}
              </h3>
            )}
            {renderSeeds()}
          </>
        ) : (
          <h3>loading playlist builder</h3>
        )}
      </div>
    </>
  );
};

export default connect(msp, {updatePlaylist, loadBuild})(PlaylistBuilder);