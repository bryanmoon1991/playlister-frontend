import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import PlaylistItem from './PlaylistItem';
import chunk from 'lodash.chunk';
import { updatePlaylist, loadBuild, deleteBuild } from '../Redux/actions';
import {
  Popup,
  Button,
  Modal,
  Header,
  List,
  Checkbox,
} from 'semantic-ui-react';

const msp = (state) => {
  return {
    user: state.user,
    playlistBuild: state.playlistBuild,
  };
};

const PlaylistBuilder = ({
  match,
  history,
  user,
  spotifyApi,
  playlistBuild,
  updatePlaylist,
  loadBuild,
  deleteBuild,
}) => {
  let [{ name }, setName] = useState({ name: playlistBuild.name });
  let [titleEdit, setTitleEdit] = useState(false);

  let [{ description }, setDescription] = useState({
    description: playlistBuild.description,
  });

  let [open, setOpen] = useState(false);

  let [collaborative, setCollaborative] = useState(false);
  let [publik, setPublik] = useState(false);

  let [slider, setSlider] = useState({ energy: 0.0, mood: 0.0, vocal: 0.0 });

  const togglePublik = () => {
    if (collaborative) {
      window.alert('Cannot be public if collaborative');
    } else {
      setPublik(!publik);
    }
  };

  const toggleCollab = () => {
    if (collaborative) {
      setCollaborative(false);
    } else {
      if (publik) {
        togglePublik();
      }
      setCollaborative(true);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    event.target.type === 'range'
      ? setSlider((prevState) => ({ ...prevState, [name]: value }))
      : setName((prevState) => ({ ...prevState, [name]: value }));
  };

  const keyPress = (e) => {
    if (e.key === 'Enter') {
      if (name === '') {
        window.alert('Playlist name cannot be blank');
      } else {
        updatePlaylist(playlistBuild.id, 'name', name);
        setTitleEdit(!titleEdit);
      }
    }
  };

  // if the user navigates to the builder from the playlists we'll use match
  // if not, the playlistBuild and playlistSeeds will be set from start new action
  useEffect(() => {
    if (match) {
      loadBuild(match.params.id);
    }
  }, []);

  const renderSeeds = () => {
    return playlistBuild.items.map((seed) => (
      <PlaylistItem key={seed.id} seed={seed} playlistId={playlistBuild.id} />
    ));
  };

  const handleDelete = (id) => {
    deleteBuild(id);
    history.push(`/users/${user.id}`);
  };

  const shuffle = (array) => {
    var currentIndex = array.length,
      temporaryValue,
      randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  };

  const publishBuild = (build) => {
    let artistIds = [];
    let trackIds = [];
    playlistBuild.items.forEach((item) => {
      switch (item.type) {
        case 'artist':
          artistIds.push(item.id);
          break;
        case 'track':
          trackIds.push(item.id);
          break;
        case 'album':
          item.tracks.items.forEach((track) => trackIds.push(track.id));
          break;
        default:
          console.log('check item, no match found');
      }
    });
    let shuffledArtists = shuffle(artistIds);
    let shuffledTracks = shuffle(trackIds);

    let artistChunks = chunk(shuffledArtists, 5);
    let trackChunks = chunk(shuffledTracks, 5);

    artistChunks.forEach((chonk) => {
      spotifyApi
        .getRecommendations({
          limit: 10,
          country: 'US',
          seed_artists: chonk,

          target_danceability: 1,
          target_energy: 1,
          target_tempo: 1,
          target_loudness: 1,

          target_instrumentalness: 1,
          target_speechiness: 1,

          target_valence: 0.1,
          target_mode: 0,
        })
        .then((data) => console.log('from artist', data));
    });

    trackChunks.forEach((chonk) => {
      spotifyApi
        .getRecommendations({
          limit: 10,
          country: 'US',
          seed_tracks: chonk,

          target_danceability: 1,
          target_energy: 1,
          target_tempo: 1,
          target_loudness: 1,

          target_instrumentalness: 1,
          target_speechiness: 1,

          target_valence: 0.1,
          target_mode: 0,
        })
        .then((data) => console.log('from tracks', data));
    });
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
            <List animated verticalAlign="middle">
              {renderSeeds()}
            </List>
            <Button.Group>
              <Popup
                trigger={<Button icon="ellipsis horizontal" />}
                content={
                  <Button.Group>
                    <Popup
                      mouseEnterDelay={500}
                      position="bottom center"
                      size="mini"
                      content="Delete this Build"
                      trigger={
                        <Button
                          icon="trash alternate"
                          size="mini"
                          onClick={() => handleDelete(playlistBuild.id)}
                        />
                      }
                    />
                    <Popup
                      mouseEnterDelay={500}
                      position="bottom center"
                      size="mini"
                      content="Set to Collaborative"
                      trigger={
                        <Button
                          icon="users"
                          size="mini"
                          onClick={() => handleDelete(playlistBuild.id)}
                        />
                      }
                    />
                    <Popup
                      mouseEnterDelay={500}
                      position="bottom center"
                      size="mini"
                      content="Set to Private"
                      trigger={
                        <Button
                          icon="user secret"
                          size="mini"
                          onClick={() => handleDelete(playlistBuild.id)}
                        />
                      }
                    />
                    <Popup
                      mouseEnterDelay={500}
                      position="bottom center"
                      size="mini"
                      content="Edit Description"
                      trigger={
                        <Button
                          icon="edit"
                          size="mini"
                          onClick={() => handleDelete(playlistBuild.id)}
                        />
                      }
                    />
                  </Button.Group>
                }
                on="click"
                position="bottom center"
              />
              <Popup
                mouseEnterDelay={500}
                position="bottom center"
                size="mini"
                content="Generate Playlist!"
                trigger={
                  <Button
                    onClick={() => setOpen(true)}
                    icon="itunes note"
                    size="mini"
                  />
                }
              />

              <Modal
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
                open={open}
              >
                <Modal.Header>Generate Playlist from this Build</Modal.Header>
                <Modal.Content>
                  {/* <Image
                    size="medium"
                    src="https://react.semantic-ui.com/images/avatar/large/rachel.png"
                    wrapped
                  /> */}
                  <Modal.Description>
                    <Header>Spotify Settings</Header>
                    {titleEdit ? (
                      <>
                        <input
                          value={name}
                          name="name"
                          onChange={handleChange}
                          onKeyDown={keyPress}
                        />
                        <br />
                      </>
                    ) : (
                      <>
                        <h3 onClick={() => setTitleEdit(!titleEdit)}>
                          {playlistBuild.name}
                        </h3>
                        <br />
                      </>
                    )}
                    <textarea
                      placeholder="enter a description of your playlist"
                      name="description"
                      onChange={handleChange}
                    />
                    <br />
                    <br />
                    <Checkbox
                      toggle
                      label="public"
                      onChange={togglePublik}
                      checked={publik}
                    />
                    <br />
                    <Checkbox
                      toggle
                      label="collaborative"
                      onChange={toggleCollab}
                      checked={collaborative}
                    />
                    <br />
                    <input
                      type="range"
                      name="energy"
                      min={0.0}
                      max={1.0}
                      step={0.1}
                      value={slider.energy}
                      onChange={handleChange}
                    />
                    <input
                      type="range"
                      name="vocal"
                      min={0.0}
                      max={1.0}
                      step={0.1}
                      value={slider.vocal}
                      onChange={handleChange}
                    />
                    <input
                      type="range"
                      name="mood"
                      min={0.0}
                      max={1.0}
                      step={0.1}
                      value={slider.mood}
                      onChange={handleChange}
                    />
                  </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                  <Button
                    content="Generate!"
                    labelPosition="right"
                    icon="checkmark"
                    onClick={() => {
                      publishBuild(playlistBuild);
                      setOpen(false);
                    }}
                    positive
                  />
                </Modal.Actions>
              </Modal>
            </Button.Group>
          </>
        ) : (
          <h3>loading playlist builder</h3>
        )}
      </div>
    </>
  );
};

export default connect(msp, { updatePlaylist, loadBuild, deleteBuild })(
  PlaylistBuilder
);
