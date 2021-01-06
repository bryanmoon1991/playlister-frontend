import React from 'react';
import { connect } from 'react-redux';
import { removeSeed, removePreview } from '../Redux/actions';
import { List, Image, Icon } from 'semantic-ui-react';

const PlaylistItem = ({
  seed,
  removeSeed,
  playlistId,
  fromPreview,
  removePreview,
}) => {
  console.log(seed);
  let preview;
  fromPreview ? (preview = new Audio(seed.preview_url)) : (preview = undefined);

  const playPreview = () => {
    if (preview) {
      let playPromise = preview.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('playing');
          })
          .catch(() => {
            console.log('no preview available');
          });
      }
    } else {
      console.log('no preview for this artist');
    }
  };

  const stopPreview = () => {
    if (preview) {
      preview.pause();
      preview.currentTime = 0;
    }
  };

  return (
    <List.Item
      className="item-content"
      onMouseEnter={() => playPreview()}
      onMouseLeave={() => stopPreview()}
      onWheel={() => stopPreview()}
    >
      {fromPreview ? (
        <a>
          <Icon
            floated="left"
            name="delete"
            onClick={() => {
              stopPreview();
              removePreview(seed);
            }}
          />
        </a>
      ) : (
        <a>
          <Icon
            floated="left"
            name="delete"
            onClick={() => removeSeed(seed, playlistId)}
          />
        </a>
      )}
      <Image
        avatar
        src={
          seed.images
            ? seed.images[0].url
            : seed.artists[0].images.length > 0
            ? seed.artists[0].images[0].url
            : 'https://reactnativecode.com/wp-content/uploads/2018/02/Default_Image_Thumbnail.png'
        }
      />
      <List.Content className="playlist-item">
        <List.Header className="item-info">{seed.name}</List.Header>
        {seed.type === 'artist' ? undefined : (
          <List.Description className="item-info">
            by {seed.artists[0].name}
          </List.Description>
        )}
      </List.Content>
    </List.Item>
  );
};

export default connect(null, { removeSeed, removePreview })(PlaylistItem);
