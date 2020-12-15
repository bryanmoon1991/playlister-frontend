import React from 'react'
import {Switch, Route} from 'react-router-dom';
import {connect} from 'react-redux';
import {fetchCurrentUser} from '../Redux/actions'
import Search from './Search'
import RecommendedContainer from './RecommendedContainer';
import Discovery from './Discovery';
import PlaylistBuilder from './PlaylistBuilder'
var Spotify = require('spotify-web-api-js');
var spotifyApi = new Spotify();

const UsersContainer = ({user, fetchCurrentUser}) => {

    const createPlaylist = () => {
        spotifyApi.setAccessToken(user.access_token)
        spotifyApi.createPlaylist(user.spotify_id, {
            "name": 'New Playlist',
            "description": "New playlist description",
            "public": false
        },
        (err, data) => err ? console.log(err) : console.log(data));
    }

        return (
            <>
              <Switch>
                  <Route
                  path='/users/:id/new'
                  render={() => {
                      return (
                          <>
                            <h3>new playlist area</h3>
                            <PlaylistBuilder/>
                            <Discovery/>
                          </>
                      )
                  }}
                  />
                  <Route
                  path="/users/:id"
                  render={({match}) => {
                    user ? 
                    console.log("user detected") :
                    fetchCurrentUser(match.params.id)
                    
                    return (
                        <>
                        {user ? 
                        <>
                            <h1>hello {user.display_name}</h1>
                            <button onClick={() => createPlaylist()}>Create Test Playlist</button>
                            <Search/>
                            <RecommendedContainer/>
                        </>
                        :
                        <h1>loading</h1>
                        }
                        </>
                    )
                }}
                  />
              </Switch>  
            </>
        )
}


const msp = (state) => {
    return {
        user: state.user,
        playlistBuild: state.playlistBuild
    }
}

export default connect(msp, {fetchCurrentUser})(UsersContainer);
