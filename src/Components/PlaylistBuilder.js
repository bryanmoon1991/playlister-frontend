import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PlaylistItem from './PlaylistItem';
import chunk from 'lodash.chunk';
import {
  updatePlaylist,
  loadBuild,
  deleteBuild,
  addTracksToPreview,
  clearPreview,
} from '../Redux/actions';
import {
  Popup,
  Button,
  Modal,
  List,
  Checkbox,
  Grid,
  Segment,
  Divider,
  Icon,
} from 'semantic-ui-react';

const msp = (state) => {
  return {
    user: state.user,
    playlistBuild: state.playlistBuild,
    preview: state.preview,
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
  addTracksToPreview,
  clearPreview,
  preview,
}) => {
  const [state, setState] = useState({
    name: '',
    titleEdit: false,
    description: '',
    open: false,
    collaborative: false,
    publik: false,
    energy: 0.0,
    mood: 0.0,
    vocal: 0.0,
    size: 20,
  });

  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    if (playlistBuild.name) {
      setState((prevState) => ({ ...prevState, name: playlistBuild.name }));
      setState((prevState) => ({
        ...prevState,
        description: playlistBuild.description,
      }));
    }
  }, []);

  let {
    name,
    titleEdit,
    description,
    open,
    collaborative,
    publik,
    energy,
    mood,
    vocal,
    size,
  } = stateRef.current;

  const togglePublik = () => {
    if (stateRef.current.collaborative) {
      window.alert('Cannot be public if collaborative');
    } else {
      setState((prevState) => ({ ...prevState, publik: !state.publik }));
    }
  };

  const toggleCollab = () => {
    if (stateRef.current.collaborative) {
      setState((prevState) => ({ ...prevState, collaborative: false }));
    } else {
      if (stateRef.current.publik) {
        togglePublik();
      }
      setState((prevState) => ({ ...prevState, collaborative: true }));
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const keyPress = (e) => {
    if (e.key === 'Enter') {
      if (name === '') {
        window.alert('Playlist name cannot be blank');
      } else {
        updatePlaylist(playlistBuild.id, 'name', name);
        setState((prevState) => ({
          ...prevState,
          titleEdit: !stateRef.current.titleEdit,
        }));
      }
    }
  };

  useEffect(() => {
    if (match) {
      loadBuild(match.params.id);
    }
  }, []);

  const renderSeeds = () => {
    return playlistBuild.items.map((seed) => (
      <PlaylistItem
        key={seed.id}
        seed={seed}
        playlistId={playlistBuild.id}
        fromPreview={false}
      />
    ));
  };

  const renderPreviews = () => {
    return preview.map((track) => (
      <PlaylistItem
        key={track.id}
        seed={track}
        playlistId={playlistBuild.id}
        fromPreview={true}
      />
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

  const buildPreview = (build) => {
    if (!preview.length) {
      clearPreview();
    }
    let artistIds = [];
    let trackIds = [];
    let chosenOnes = [];
    playlistBuild.items.forEach((item) => {
      switch (item.type) {
        case 'artist':
          artistIds.push(item.id);
          break;
        case 'track':
          chosenOnes.push(item);
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
    let limit;
    let totalChunks = artistChunks.length + trackChunks.length;

    if (totalChunks > size) {
      limit = Math.ceil(totalChunks / size);
    } else if (totalChunks < size) {
      limit = Math.ceil(size / totalChunks);
    } else if (totalChunks === size) {
      limit = 1;
    }
    artistChunks.forEach((chonk) => {
      spotifyApi
        .getRecommendations({
          limit: limit,
          country: 'US',
          seed_artists: chonk,

          target_danceability: energy,
          target_energy: energy,
          target_tempo: energy,
          target_loudness: energy,

          target_instrumentalness: vocal,
          // target_speechiness: vocal,

          target_valence: mood,
          target_mode: mood > 0.5 ? 1 : 0,
        })
        .then((data) => {
          addTracksToPreview(data.tracks, spotifyApi);
        });
    });

    trackChunks.forEach((chonk) => {
      spotifyApi
        .getRecommendations({
          limit: limit,
          country: 'US',
          seed_tracks: chonk,

          target_danceability: energy,
          target_energy: energy,
          target_tempo: energy,
          target_loudness: energy,

          target_instrumentalness: vocal,
          // target_speechiness: vocal,

          target_valence: mood,
          target_mode: mood > 0.5 ? 1 : 0,
        })
        .then((data) => {
          let total = [];
          if (chosenOnes.length) {
            total = [...chosenOnes, ...data.tracks];
          }
          addTracksToPreview(total, spotifyApi);
        });
    });
  };

  const commitChangesAndPublish = () => {
    let body = {
      public: publik,
      collaborative: collaborative,
      description: description,
    };
    fetch(`http://localhost:3000/api/v1/playlists/${playlistBuild.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then((r) => r.json())
      .then((data) => {
        console.log(data);
        spotifyApi.getMe().then((data) => {
          spotifyApi
            .createPlaylist(data.id, {
              name: name,
              public: publik,
              collaborative: collaborative,
              description: description,
            })
            .then((data) => {
              console.log(data);
              spotifyApi
                .addTracksToPlaylist(
                  data.id,
                  preview.map((track) => track.uri)
                )
                .then((data) => {
                  console.log(data);
                });
            });
        });
      });
  };
  console.log('build', playlistBuild);

  return (
    <>
      <div className="builder">
        {playlistBuild.name ? (
          <>
            {titleEdit ? (
              <input
                value={name}
                type="text"
                name="name"
                onChange={handleChange}
                onKeyDown={keyPress}
              ></input>
            ) : (
              <h3
                onClick={() => {
                  setState((prevState) => ({
                    ...prevState,
                    titleEdit: !stateRef.current.titleEdit,
                  }));
                }}
              >
                {playlistBuild.name}
              </h3>
            )}
            <List className="playlist-container" verticalAlign="middle">
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
                    onClick={() => {
                      clearPreview();
                      setState((prevState) => ({
                        ...prevState,
                        open: true,
                      }));
                    }}
                    icon="itunes note"
                    size="mini"
                  />
                }
              />

              <Modal
                onClose={() =>
                  setState((prevState) => ({
                    ...prevState,
                    open: false,
                  }))
                }
                onOpen={() =>
                  setState((prevState) => ({
                    ...prevState,
                    open: true,
                  }))
                }
                open={open}
              >
                <Modal.Header>Generate Playlist from this Build</Modal.Header>
                <Modal.Content>
                  <Modal.Description>
                    <Segment placeholder>
                      <Grid columns={2} relaxed="very" stackable>
                        <Grid.Column>
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
                              <h3
                                onClick={() =>
                                  setState((prevState) => ({
                                    ...prevState,
                                    titleEdit: !stateRef.current.titleEdit,
                                  }))
                                }
                              >
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
                          <p>Energy:</p>
                          <input
                            type="range"
                            name="energy"
                            min={0.0}
                            max={1.0}
                            step={0.1}
                            value={energy}
                            onChange={handleChange}
                          />
                          <p>Vocal:</p>
                          <input
                            type="range"
                            name="vocal"
                            min={0.0}
                            max={1.0}
                            step={0.1}
                            value={vocal}
                            onChange={handleChange}
                          />
                          <p>Mood:</p>
                          <input
                            type="range"
                            name="mood"
                            min={0.0}
                            max={1.0}
                            step={0.1}
                            value={mood}
                            onChange={handleChange}
                          />
                          <p>Length in tracks:</p>
                          <input
                            type="range"
                            name="size"
                            min={20}
                            max={100}
                            value={size}
                            onChange={handleChange}
                          />
                        </Grid.Column>

                        <Grid.Column>
                          {preview.length > 0 ? (
                            <List>{renderPreviews()}</List>
                          ) : (
                            <h4>playlist will show here</h4>
                          )}
                        </Grid.Column>
                      </Grid>

                      <Divider vertical>
                        <Icon name="sound" />
                      </Divider>
                    </Segment>
                  </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                  <Button
                    content="Preview"
                    labelPosition="right"
                    icon="sound"
                    onClick={() => {
                      buildPreview(playlistBuild);
                    }}
                    positive
                  />
                  <Button
                    content="Publish"
                    labelPosition="right"
                    icon="checkmark"
                    onClick={() => {
                      commitChangesAndPublish();
                      setState((prevState) => ({
                        ...prevState,
                        open: false,
                      }));
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

export default connect(msp, {
  updatePlaylist,
  loadBuild,
  deleteBuild,
  addTracksToPreview,
  clearPreview,
})(withRouter(PlaylistBuilder));
