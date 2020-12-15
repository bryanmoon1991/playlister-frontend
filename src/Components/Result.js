import React from 'react'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

const msp = state => {
  return {
    user: state.user
  }
}

const Result = (props) => {
    let preview
    props.track ? (props.track.preview_url ? preview = new Audio(props.track.preview_url) : console.log('track with no preview')) : console.log('no preview')


    const playPreview = () => {
      if (props.artist) {
        console.log('artist result');
      } else if (props.track.preview_url) {
        preview.play();
      } else {
        console.log('track with no preview')
      }
    };

    const stopPreview = () => {
      if (props.artist) {
        console.log('artist result');
      } else if (props.track.preview_url) {
        preview.pause();
        preview.currentTime = 0
      } else {
        console.log('track with no preview') 
      }
    };

    const startNew = (userId, seedId) => {
      fetch('http://localhost:3000/api/v1/playlists',{
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
                  "Accept": "application/json"
              },
              body: JSON.stringify({
                user_id: userId,
                name: "newPlaylist",
                private: false,
                description: "Playlist created with Perfect Playlist",
                href: "",
                spotify_id: "",
                images: '{}',
                items: `{${seedId}}`,
                uri: ""
              })
          })
          .then(r => r.json())
          .then(console.log)
    }
    
    return (
      <>
        {props.artist ? (
          <div className="artist">
            <h3 onClick={() => startNew(props.user.id, props.artist.id)}>
              <Link to={`/users/${props.user.id}/new`}>{props.artist.name}</Link>
              {/* {props.artist.images ? 
                <img src={props.artist.images[props.artist.images.length - 1].url} alt={props.artist.name} /> :
            undefined} */}
            </h3>
          </div>
        ) : (
          <div className="track">
            <li>
              {props.track.name}
              {props.track.album.images ? (
                <img
                  src={
                    props.track.album.images[
                      props.track.album.images.length - 1
                    ].url
                  }
                  alt={props.track.name}
                  onMouseOver={() => playPreview()}
                  onMouseOut={() => stopPreview()}
                />
              ) : undefined}
            </li>
          </div>
        )}
      </>
    );
}

export default connect(msp)(Result);