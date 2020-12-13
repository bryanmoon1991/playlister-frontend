import React from 'react'

const Result = (props) => {
    let preview
    props.track ? (props.track.preview_url ? preview = new Audio(props.track.preview_url) : console.log("track with no preview")) : console.log('no preview')


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
        console.log("track with no preview") 
      }
    };
    
    return (
      <>
        {props.artist ? (
          <div className="artist">
            <h3>
              {props.artist.name}
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

export default Result;