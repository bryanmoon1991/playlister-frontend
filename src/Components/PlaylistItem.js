import React from 'react';
import { connect } from 'react-redux';
import { removeSeed } from '../Redux/actions';
import { List, Image, Icon } from 'semantic-ui-react';

const PlaylistItem = ({ seed, removeSeed, playlistId }) => {
  return (
    <List.Item>
      <Image
        avatar
        src={
          seed.images
            ? seed.images[0].url
            : 'https://reactnativecode.com/wp-content/uploads/2018/02/Default_Image_Thumbnail.png'
        }
      />
      <List.Content>
        <List.Header>
          {seed.name}
          <Icon name="delete" onClick={() => removeSeed(seed, playlistId)} />
        </List.Header>
      </List.Content>
    </List.Item>
  );
};

export default connect(null, { removeSeed })(PlaylistItem);
