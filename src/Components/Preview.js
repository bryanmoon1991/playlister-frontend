import React, {useEffect, useState} from 'react'
import { Popup } from 'semantic-ui-react'

const Preview = ({album, spotifyApi}) => {

    let [track, setTrack] = useState(undefined);
    let [info, setInfo] = useState({ album: "", title: ""})

    useEffect(() => {
      spotifyApi.getAlbumTracks(album.id, 'US').then((data) => {
        for (let i = 0; i < data.items.length; i++) {
            let random = Math.floor(Math.random() * Math.floor(data.items.length));
            if (data.items[random].preview_url) {
                setTrack(new Audio(data.items[random].preview_url));
                setInfo({album: album.name, title: data.items[random].name})
                break;
            }
        }
      });
      
      return () => {
        setTrack(undefined);
        setInfo({ album: "", title: "" })
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
        <>
        <Popup
            header={`Album: ${info.album}`}
            content={`Track: ${info.title}`}
            size='mini'
            trigger={
                <img 
                onMouseOver={() => playPreview()}
                onMouseOut={() => stopPreview()}
                src={album.images[album.images.length - 1].url}
                alt={album.name} 
                />
            }
        />
        </>
    );
}

export default Preview;