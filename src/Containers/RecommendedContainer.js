import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { fetchRecommended } from '../Redux/actions';
import { motion, AnimatePresence } from 'framer-motion';
import { wrap } from 'popmotion';
import { startNew } from '../Redux/actions';
import '../Styles/Recommended.css';
import * as BiIcons from 'react-icons/bi';

const msp = (state) => {
  return {
    user: state.user,
    recommended: state.recommended,
  };
};

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

const RecommendedContainer = ({
  user,
  startNew,
  recommended,
  fetchRecommended,
  spotifyApi,
}) => {
  useEffect(() => {
    fetchRecommended(spotifyApi);
  }, []);

  const [[page, direction], setPage] = useState([0, 0]);
  const imageIndex = recommended.images
    ? wrap(0, recommended.images.length, page)
    : console.log('first render');
  const paginate = (newDirection) => {
    setPage([page + newDirection, newDirection]);
  };

  console.log(recommended);

  return (
    <>
      {recommended.images && (
        <>
          <div className="recommended">
            <div className="next" onClick={() => paginate(1)}>
              <BiIcons.BiCaretLeft />
            </div>
            <AnimatePresence initial={false} custom={direction}>
              <Link to={`/users/${user.id}/new`}>
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
                  onClick={() => {
                    startNew(
                      user.id,
                      recommended.artists.items[imageIndex],
                      spotifyApi
                    );
                  }}
                />
              </Link>
            </AnimatePresence>
            <div className="prev" onClick={() => paginate(-1)}>
              <BiIcons.BiCaretRight />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default connect(msp, { fetchRecommended, startNew })(
  RecommendedContainer
);
