import React from 'react'

const Result = (props) => {
    return (
       <>
       {props.artist ?
        <div className="artist">
            <li>
                {props.artist.name}
                {/* {props.artist.images ? 
                <img src={props.artist.images[props.artist.images.length - 1].url} alt={props.artist.name} /> :
                undefined} */}
            </li>
        </div>   
        :
        <div className="track">
            <li>
                {props.track.name}
                {/* {props.track.album.images ? 
                <img src={props.track.album.images[props.track.album.images.length - 1].url} alt={props.track.name}/> :
                undefined} */}
            </li>
        </div>
    }
       </> 
    )
}

export default Result;