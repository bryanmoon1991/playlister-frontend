import React from 'react'
import {Switch, Route} from 'react-router-dom';
import {connect} from 'react-redux';
import {fetchCurrentUser} from '../Redux/actions'

var Spotify = require('spotify-web-api-js');
var spotifyApi = new Spotify();

const UsersContainer = ({user, fetchCurrentUser}) => {

    // const componentDidMount = () => {
    //     props.user ?
    //     console.log("already found user") :
    //     fetch(`http://localhost:3000/api/v1/users/${id}`)
    //       .then(response => response.json())
    //       .then(user => {
    //         this.setState({user: user});
    //         spotifyApi.setAccessToken(user.access_token)
    //     })
        
    // }

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
        user: state.user
    }
}

export default connect(msp, {fetchCurrentUser})(UsersContainer);
