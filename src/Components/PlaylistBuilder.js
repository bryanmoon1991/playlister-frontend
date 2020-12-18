import React, {useState, useEffect} from 'react';
import { connect } from 'react-redux';
import PlaylistItem from './PlaylistItem';
import {updatePlaylist, loadBuild, deleteBuild} from '../Redux/actions'

const msp = (state) => {
  return {
    user: state.user,
    playlistBuild: state.playlistBuild,
  };
};

const PlaylistBuilder = ({match, history, user, spotifyApi, playlistBuild, updatePlaylist, loadBuild, deleteBuild}) => {
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

  const handleDelete = (id) => {
    deleteBuild(id)
    history.push(`/users/${user.id}`) 
  }

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
            {match ? (
              <button onClick={() => handleDelete(playlistBuild.id)}>
                Delete this build
              </button>
            ) : undefined}
          </>
        ) : (
          <h3>loading playlist builder</h3>
        )}
      </div>
    </>
  );
};

export default connect(msp, {updatePlaylist, loadBuild, deleteBuild})(PlaylistBuilder);