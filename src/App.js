import React from 'react'; 
import {Route, withRouter, Link} from 'react-router-dom'
import UsersContainer from './Components/UsersContainer'
import {connect} from 'react-redux';
import './App.css';


const App = ({user}) => {
  
  return (
    <>
        {user ? (
          <>
            <a href="http://spotify.com/logout">Logout</a>
            <Link
            to={`/users/${user.id}/playlists`}>
            My Playlists
            </Link>
          </>
        ) : (
          <a href="http://localhost:3000/api/v1/login">OAUTH LOGIN</a>
          )}
        <Route 
        path="/users"
        component={UsersContainer}
        />
      </>
    );
}

const msp = state => {
  return {
    user: state.user
  }
}


export default withRouter(connect(msp)(App));
