import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Card, Image, Icon } from 'semantic-ui-react';
import '../Styles/BuildsContainer.css';

const msp = (state) => {
  return {
    user: state.user,
    playlists: state.playlists,
  };
};

const BuildsContainer = ({ user, playlists }) => {
  console.log(user, playlists);

  const renderBuilds = () => {
    return playlists.map((playlist) => (
      <Card
        as={Link}
        to={`/users/${user.id}/playlists/${playlist.id}`}
        key={playlist.id}
      >
        <Image src={playlist.items[0].images[0].url} wrapped ui={false} />
        <Card.Content>
          <Card.Header>{playlist.name}</Card.Header>
          <Card.Meta>
            <span className="date">genres?</span>
          </Card.Meta>
          <Card.Description>{playlist.decription}</Card.Description>
        </Card.Content>
        <Card.Content extra>
          <p>
            <Icon name="user" />
            {`${playlist.items.length} seeds in this build`}
          </p>
        </Card.Content>
      </Card>
    ));
  };

  return (
    <div>
      {playlists[0] ? (
        <div className="builds">{renderBuilds()}</div>
      ) : (
        <h3>loading playlists</h3>
      )}
    </div>
  );
};

export default connect(msp)(BuildsContainer);
