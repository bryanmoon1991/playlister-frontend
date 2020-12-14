import {connect} from 'react-redux';
import React, {useEffect, useState} from 'react'
import {fetchRecommended} from '../Redux/actions'
import { motion, AnimatePresence } from 'framer-motion';
import { wrap } from 'popmotion';
var Spotify = require('spotify-web-api-js');
var spotifyApi = new Spotify()

const msp = state => {
    return {
        user: state.user,
        recommended: state.recommended
    }
}

const variants = {
  enter: (direction) => {
    return {
      x: direction > 0 ? 500 : -500,
      opacity: 0,
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 500 : -500,
      opacity: 0,
    };
  },
};


const RecommendedContainer = ({user, recommended, fetchRecommended}) => {
    spotifyApi.setAccessToken(user.access_token);
    
    useEffect(() => {
        fetchRecommended(spotifyApi)
    }, [])

    
    const [[page, direction], setPage] = useState([0, 0]); 

    const imageIndex = recommended.images ? wrap(0, recommended.images.length, page) : console.log('first render')
    
    const paginate = (newDirection) => {
        setPage([page + newDirection, newDirection]);
    }; 
    
    console.log("in container:", recommended)

    const autoFlip = () => {
        paginate(1)
        setTimeout(() => autoFlip(), 5000)
    }
    return (
      <>
        {recommended.images && (
          <>
            <div className="next" onClick={() => paginate(1)}>
                {'‣'}
            </div>
            <AnimatePresence initial={false} custom={direction}>
              <motion.img
                key={page}
                src={recommended.images[imageIndex].url}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: 'spring', stiffness: 500, damping: 30 },
                  opacity: { duration: 0.1 },
                }}
              />
            </AnimatePresence>

            <div className="prev" onClick={() => paginate(-1)}>
              {'‣'}
            </div>
          </>
        )}
      </>
    );
}

export default connect(msp, {fetchRecommended})(RecommendedContainer);
