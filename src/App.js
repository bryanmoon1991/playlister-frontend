import React, { useState } from 'react';
import { Route, withRouter, Link } from 'react-router-dom';
import UsersContainer from './Containers/UsersContainer';
import { connect } from 'react-redux';
import { clearResults, handleLogout } from './Redux/actions';
import { Menu, Button } from 'semantic-ui-react';
import './App.css';

const App = ({ user, clearResults, history, handleLogout }) => {
  let [activeItem, setActiveItem] = useState('home');

  const handleItemClick = (e) => {
    let { name } = e.target;
    setActiveItem(name);
  };

  const logOut = () => {
    localStorage.clear();
    handleLogout();
    history.push('/');
    window.location.reload(true);
  };

  return (
    <>
      {user ? (
        <>
          <Menu color="grey" size="small">
            <Menu.Item
              as={Link}
              to={`/users/${user.id}`}
              name="home"
              active={activeItem === 'home'}
              onClick={(e) => {
                handleItemClick(e);
                clearResults();
              }}
            />
            <Menu.Item
              as={Link}
              to={`/users/${user.id}/playlists`}
              name="playlists"
              active={activeItem === 'playlists'}
              onClick={(e) => {
                handleItemClick(e);
                clearResults();
              }}
            />

            <Menu.Item position="right">
              <Button onClick={() => logOut()} primary>
                Log Out
              </Button>
            </Menu.Item>
          </Menu>
        </>
      ) : (
        <>
          <div className="login">
            <div className="login-items">
              <Button
                className="login-button"
                color="green"
                circular
                icon="spotify"
                size="massive"
                as="a"
                href="http://localhost:3000/api/v1/login"
              />
              <h2>perfect playlist</h2>
            </div>
          </div>
        </>
      )}
      <Route path="/users" component={UsersContainer} />
    </>
  );
};

const msp = (state) => {
  return {
    user: state.user,
  };
};

export default withRouter(connect(msp, { clearResults, handleLogout })(App));
