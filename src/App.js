import React from 'react'; 
import {Route, withRouter} from 'react-router-dom'
import UsersContainer from './Components/UsersContainer'
import {connect} from 'react-redux';
// import Anime from 'react-anime';

import './App.css';

const App = ({user}) => {

    return (
      <>
      {user ?
      <a href="http://spotify.com/logout" target="_blank">Logout</a> :
      <a href="http://localhost:3000/api/v1/login">OAUTH LOGIN</a>
      }
          

        <Route path="/users" render={() => <UsersContainer />} />
        {/* <Anime
          easing="easeOutElastic"
          loop={true}
          duration={2000}
          direction="normal"
          delay={(el, index) => index * 200}
          translateX="30rem"
          // scale={[0.75, 0.9]}
        >
          <img
            src="https://static.toiimg.com/thumb/msid-67586673,width-800,height-600,resizemode-75,imgsize-3918697,pt-32,y_pad-40/67586673.jpg"
            className="cat"
          />
          <img
            src="https://static.scientificamerican.com/sciam/cache/file/92E141F8-36E4-4331-BB2EE42AC8674DD3_source.jpg"
            className="green"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/6/69/June_odd-eyed-cat_cropped.jpg"
            className="red"
          />
        </Anime> */}
      </>
    );
}

const msp = state => {
  return {
    user: state.user
  }
}


export default withRouter(connect(msp)(App));
