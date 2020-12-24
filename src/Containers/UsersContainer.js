import React from 'react'
import {Switch, Route} from 'react-router-dom';
import {connect} from 'react-redux';
import {fetchCurrentUser, fetchCurrentUsersBuilds} from '../Redux/actions'
import Search from '../Components/Search'
import RecommendedContainer from '../Containers/RecommendedContainer';
import Discovery from '../Components/Discovery';
import PlaylistBuilder from '../Components/PlaylistBuilder'
import UnpublishedContainer from '../Containers/UnpublishedContainer';
import '../Styles/Views.css'
var Spotify = require('spotify-web-api-js');

const msp = (state) => {
    return {
      user: state.user,
      playlistBuild: state.playlistBuild
    }
}

const UsersContainer = ({user, fetchCurrentUser, fetchCurrentUsersBuilds}) => {
  // instantiating spotify api wrapper
  let spotifyApi = new Spotify()
  // initial access token set, refresh token handled in actions 
  if (user) {
    spotifyApi.setAccessToken(user.access_token)
  }
 
  return (
    <>
      <Switch>
        <Route path="/users/:id/playlists/:id" component={PlaylistBuilder} />
        <Route
          path="/users/:id/playlists"
          render={({ match }) => {
            fetchCurrentUsersBuilds(match.params.id);
            return (
              <>
                <div className="playlists">
                  <h3>Where the Playlists go</h3>
                  <UnpublishedContainer />
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
                  <PlaylistBuilder />
                  <Discovery spotifyApi={spotifyApi} />
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
                      <Search spotifyApi={spotifyApi}/>
                      <h2>...a recommended item</h2>
                      <RecommendedContainer spotifyApi={spotifyApi}/>
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


export default connect(msp, {fetchCurrentUser, fetchCurrentUsersBuilds})(UsersContainer);