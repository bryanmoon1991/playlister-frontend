import React, { useState } from 'react';
import { Route, withRouter, Link } from 'react-router-dom';
import UsersContainer from './Containers/UsersContainer';
import { connect } from 'react-redux';
import { clearResults } from './Redux/actions';
import { Menu, Button } from 'semantic-ui-react';
import './App.css';

const App = ({ user, clearResults }) => {
  let [activeItem, setActiveItem] = useState('home');

  const handleItemClick = (e) => {
    let { name } = e.target;
    setActiveItem(name);
  };

  return (
    // <>
    //     {user ? (
    //       <>
    //         <a href="http://spotify.com/logout">Logout</a>
    //         <Link
    //         to={`/users/${user.id}/playlists`}>
    //         My Playlists
    //         </Link>
    //         <Link
    //         to={`/users/${user.id}`}
    //         onClick={() => clearResults()}>
    //           Home
    //         </Link>
    //       </>
    //     ) : (
    //         <a href="http://localhost:3000/api/v1/login">OAUTH LOGIN</a>
    //       )}
    //     <Route
    //     path="/users"
    //     component={UsersContainer}
    //     />
    //   </>
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
              <Button primary>Log Out</Button>
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
          {/* <svg>
            <path
              id="curve"
              d="M100 200 A50 50 0 0 0 200 200"
              fill="transparent"
            />
            <text width="800">
              <textPath xlinkHref="#curve">perfect playlist</textPath>
            </text>
          </svg> */}
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

export default withRouter(connect(msp, { clearResults })(App));
