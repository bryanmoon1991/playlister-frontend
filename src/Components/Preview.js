import React, {useEffect, useState} from 'react'

const Preview = ({album, spotifyApi}) => {

    let [track, setTrack] = useState(undefined);

    useEffect(() => {
      spotifyApi.getAlbumTracks(album.id, 'US').then((data) => {
        for (let i = 0; i < data.items.length; i++) {
            let random = Math.floor(Math.random() * Math.floor(data.items.length));
            if (data.items[random].preview_url) {
        //     if (data.items[i].preview_url) {
                setTrack(new Audio(data.items[random].preview_url));
                break;
            }
        }
      });
      
    //  

      return () => {
        setTrack(undefined);
      };
    }, [spotifyApi]);

    const playPreview = () => {
      track ? track.play() : console.log('no preview for this artist');
    };

    const stopPreview = () => {
      if (track) {
        track.pause();
        track.currentTime = 0;
      }
    };
    
    return (
      <img 
      onMouseOver={() => playPreview()}
      onMouseOut={() => stopPreview()}
      src={album.images[album.images.length - 1].url}
      alt={album.name} 
      />
    );
}

export default Preview;