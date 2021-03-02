import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Card, Image, Icon, Button, Popup, Loader } from 'semantic-ui-react';
import '../Styles/BuildsContainer.css';
import { loadBuild, continueBuild, deleteBuild } from '../Redux/actions';

const msp = (state) => {
	return {
		user: state.user,
		playlists: state.playlists,
	};
};

const BuildsContainer = ({
	user,
	playlists,
	loadBuild,
	continueBuild,
	spotifyApi,
	deleteBuild,
	history,
}) => {
	console.log(user, playlists);

	const shuffle = (array) => {
		var currentIndex = array.length,
			temporaryValue,
			randomIndex;

		// While there remain elements to shuffle...
		while (0 !== currentIndex) {
			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			// And swap it with the current element.
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}

		return array;
	};

	const renderGenres = (playlist) => {
		let genres = [];
		playlist.items.forEach((item) => {
			if (item.genres) {
				item.genres.forEach((genre) => genres.push(genre));
			}
		});
		let shuffled = [...new Set(shuffle(genres))];
		if (shuffled.length > 7) {
			return shuffled.splice(0, 7).join(', ') + '...';
		} else {
			return shuffled.join(', ');
		}
	};

	const handleDelete = (id) => {
		deleteBuild(id);
		history.push(`/users/${user.id}`);
	};

	const renderBuilds = () => {
		return playlists.map((playlist) => (
			<Card key={playlist.id} color={playlist.published ? 'green' : 'red'}>
				<Image src={playlist.items[0].images[0].url} wrapped ui={false} />
				<Card.Content>
					<Card.Header
					// as={Link}
					// to={`/users/${user.id}/playlists/${playlist.id}`}
					// onClick={() => loadBuild(playlist.id)}
					>
						{playlist.name}
					</Card.Header>
					<Card.Meta>
						<span className="genres">
							<strong>Genres: </strong>
							{renderGenres(playlist)}
						</span>
					</Card.Meta>
					<Card.Description>{playlist.description}</Card.Description>
				</Card.Content>
				<Card.Content>
					<Button.Group>
						<Popup
							mouseEnterDelay={500}
							position="bottom center"
							size="mini"
							content="Edit this Build"
							trigger={
								<Button
									as={Link}
									to={`/users/${user.id}/new`}
									onClick={() => {
										loadBuild(playlist.id);
										continueBuild(
											playlist.history[playlist.history.length - 1],
											spotifyApi
										);
									}}
									icon="edit"
									size="medium"
								/>
							}
						/>
						<Popup
							mouseEnterDelay={500}
							position="bottom center"
							size="mini"
							content="Delete this Build"
							trigger={
								<Button
									onClick={() => {
										handleDelete(playlist.id);
									}}
									icon="trash"
									size="medium"
								/>
							}
						/>
					</Button.Group>
					{playlist.published ? (
						<Popup
							mouseEnterDelay={500}
							position="bottom center"
							size="mini"
							content="Open in Spotify"
							trigger={
								<Button
									floated="right"
									as="a"
									target="_blank"
									href={playlist.href}
									icon="spotify"
									size="medium"
								/>
							}
						/>
					) : undefined}
				</Card.Content>
				<Card.Content extra>
					<p>
						<Icon name="sound" />
						{`${playlist.items.length} seeds in this build`}
					</p>
				</Card.Content>
			</Card>
		));
	};

	return (
		<div>
			{playlists[0] ? (
				<>
					<div className="builds-container">
						<Card.Group className="cards" itemsPerRow={5}>
							{renderBuilds()}
						</Card.Group>
					</div>
				</>
			) : (
				<Loader active inline="centered" />
			)}
		</div>
	);
};

export default withRouter(
	connect(msp, { loadBuild, continueBuild, deleteBuild })(BuildsContainer)
);
