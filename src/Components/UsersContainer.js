import React, {Component} from 'react'
import {Switch, Route} from 'react-router-dom';

var Spotify = require('spotify-web-api-js');
var spotifyApi = new Spotify();

class UsersContainer extends Component {
    

    state = {
        user: null
    }

    findProfile = (id) => {
        this.state.user ?
        console.log("already found user") :
        fetch(`http://localhost:3000/api/v1/users/${id}`)
          .then(response => response.json())
          .then(user => {
            this.setState({user: user});
            spotifyApi.setAccessToken(user.access_token)
        })
    }

    createPlaylist = () => {
        spotifyApi.createPlaylist(this.state.user.spotify_id, {
            "name": 'New Playlist',
            "description": "New playlist description",
            "public": false
        },
        (err, data) => err ? console.log(err) : console.log(data));
    }


    render() {
        return (
            <>
              <Switch>
                  <Route
                  path="/users/:id"
                  render={({match}) => {
                    this.state.user ? 
                    console.log("user detected") :
                    this.findProfile(match.params.id)
                    
                    return (
                        <>
                        {this.state.user ? 
                        <>
                            <h1>hello {this.state.user.display_name}</h1>
                            <button onClick={() => this.createPlaylist()}>Create Test Playlist</button>
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
}

export default UsersContainer;
