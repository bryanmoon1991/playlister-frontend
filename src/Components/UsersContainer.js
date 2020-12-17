import React from 'react'
import {Switch, Route} from 'react-router-dom';
import {connect} from 'react-redux';
import {fetchCurrentUser, fetchCurrentUsersPlaylists} from '../Redux/actions'
import Search from './Search'
import RecommendedContainer from './RecommendedContainer';
import Discovery from './Discovery';
import PlaylistBuilder from './PlaylistBuilder'
import './Views.css'

const UsersContainer = ({user, fetchCurrentUser, fetchCurrentUsersPlaylists}) => {

    // const createPlaylist = () => {
    //     spotifyApi.createPlaylist(user.spotify_id, {
    //         "name": 'New Playlist',
    //         "description": "New playlist description",
    //         "public": false
    //     },
    //     (err, data) => err ? console.log(err) : console.log(data));
    // }

        return (
          <>
            <Switch>
              <Route
                path="/users/:id/playlists"
                render={({ match }) => {
                    fetchCurrentUsersPlaylists(match.params.id)
                    return (
                    <>
                    <div className="playlists">
                      <h3>Where the Playlists go</h3>
                    </div>
                    </>
                  );
                }}
              />
              <Route
                path="/users/:id/new"
                render={() => {
                  return (
                    <>
                    <div className="discover">
                      <PlaylistBuilder/>
                      <Discovery/>
                    </div>
                    </>
                  );
                }}
              />
              <Route
                path="/users/:id"
                render={({ match }) => {
                  user
                    ? console.log('user detected')
                    : fetchCurrentUser(match.params.id);

                  return (
                    <>
                      {user ? (
                        <>
                          <div className="home">
                            {/* <button onClick={() => createPlaylist()}>
                            Create Test Playlist
                          </button> */}
                            <Search />
                            <h2>...a recommended item</h2>
                            <RecommendedContainer />
                          </div>
                        </>
                      ) : (
                        <h1>loading</h1>
                      )}
                    </>
                  );
                }}
              />
            </Switch>
          </>
        );
}


const msp = (state) => {
    return {
        user: state.user,
        playlistBuild: state.playlistBuild
    }
}

export default connect(msp, {fetchCurrentUser, fetchCurrentUsersPlaylists})(UsersContainer);
