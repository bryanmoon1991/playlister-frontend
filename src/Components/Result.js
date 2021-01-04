import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { startNew } from '../Redux/actions';
import { List, Image } from 'semantic-ui-react';

const msp = (state) => {
  return {
    user: state.user,
  };
};

const Result = ({ user, artist, startNew, spotifyApi }) => {
  return (
    <>
      {artist ? (
        <List.Item
          className="result"
          as={Link}
          to={`/users/${user.id}/new`}
          onClick={() => startNew(user.id, artist, spotifyApi)}
        >
          <Image
            avatar
            src={
              artist.images
                ? artist.images.length
                  ? artist.images[0].url
                  : 'https://t4.ftcdn.net/jpg/03/32/59/65/360_F_332596535_lAdLhf6KzbW6PWXBWeIFTovTii1drkbT.jpg'
                : 'https://t4.ftcdn.net/jpg/03/32/59/65/360_F_332596535_lAdLhf6KzbW6PWXBWeIFTovTii1drkbT.jpg'
            }
          />
          <List.Content>
            <List.Header>{artist.name}</List.Header>
            <List.Description>
              Followers: {artist.followers.total}
            </List.Description>
          </List.Content>
        </List.Item>
      ) : undefined}
    </>
  );
};

export default connect(msp, { startNew })(Result);
