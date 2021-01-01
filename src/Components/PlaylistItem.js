import React from 'react';
import { connect } from 'react-redux';
import { removeSeed } from '../Redux/actions';
import { List, Image, Icon } from 'semantic-ui-react';

const PlaylistItem = ({ seed, removeSeed, playlistId }) => {
  console.log(seed);
  return (
    <List.Item className="playlist-item">
      <Image
        avatar
        src={
          seed.images
            ? seed.images[0].url
            : seed.artists[0].images
            ? seed.artists[0].images[0].url
            : 'https://reactnativecode.com/wp-content/uploads/2018/02/Default_Image_Thumbnail.png'
        }
      />
      <List.Content>
        <List.Header>
          {seed.name}
          <a>
            <Icon
              floated="right"
              name="delete"
              onClick={() => removeSeed(seed, playlistId)}
            />
          </a>
        </List.Header>
        {seed.type === 'artist' ? undefined : (
          <List.Description>by {seed.artists[0].name}</List.Description>
        )}
      </List.Content>
    </List.Item>
  );
};

export default connect(null, { removeSeed })(PlaylistItem);
