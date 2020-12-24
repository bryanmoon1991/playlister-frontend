import {connect} from 'react-redux';
import React, {useEffect, useState} from 'react'
import {fetchRecommended} from '../Redux/actions'
import { motion, AnimatePresence } from 'framer-motion';
import { wrap } from 'popmotion';
import '../Styles/Recommended.css'
import * as BiIcons from 'react-icons/bi'

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


const RecommendedContainer = ({user, recommended, fetchRecommended, spotifyApi}) => {
  // mouse over recommended images to pause carousel
  // const[running, setRunning] = useState(true)
  // const runningRef = useRef(running)
  // runningRef.current = running 
  
    
  useEffect(() => {
    fetchRecommended(spotifyApi)
    // return function cleanup() {
    //   setRunning(false)
    // }
  }, [])

  // paginating the recommended items 
  const [[page, direction], setPage] = useState([0, 0]); 
  const imageIndex = recommended.images ? wrap(0, recommended.images.length, page) : console.log('first render')
  const paginate = (newDirection) => {
    setPage([page + newDirection, newDirection]);
  }; 

  // automate flipping through the recommended items
  // setTimeout(() => {
  //   if (runningRef.current) {
  //     paginate(1)
  //   } 
  // }, 4000) 

  return (
    <>
      {recommended.images && (
        <>
        <div className="recommended">
          <div className="next" onClick={() => paginate(1)}>
            <BiIcons.BiCaretLeft/>
          </div>
          <AnimatePresence initial={false} custom={direction}>
            <motion.img
              // onMouseOver={() => setRunning(false)}
              // onMouseOut={() => setRunning(true)}
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
            <BiIcons.BiCaretRight/>
          </div>
        </div>
        </>
      )}
    </>
  );
}

export default connect(msp, {fetchRecommended})(RecommendedContainer);
