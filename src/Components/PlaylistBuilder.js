// import React, {useState, useEffect} from 'react'
// import {connect} from 'react-redux'
// import {loadBuild} from '../Redux/actions'
// import PlaylistItem from './PlaylistItem'

// const msp = state => {
//     return {
//         user: state.user,
//         spotifyApi: state.spotifyApi,
//         playlistBuild: state.playlistBuild,
//     }
// }

// const PlaylistBuilder = ({user, playlistBuild, spotifyApi}) => {


//     console.log("in playlistBuilder:", playlistBuild)


//     let [seeds, setSeeds] = useState([])

//     useEffect(() => {
//         if (playlistBuild.items) {
//             if (playlistBuild.items.length === 1) {
//               spotifyApi.getArtist(playlistBuild.items[0])
//               .then(data => {
//                 setSeeds(data)
//                 console.log("seeds", seeds)
//             });
            
//             } else if (playlistBuild.items.length === 0) {
//                 return;
//             } else {
//               // need to check if this works
//               spotifyApi.getArtists(playlistBuild.items.join(', '))
//               .then((data) => setSeeds(data));
//             }
//         }
//     }, [playlistBuild])
    

//     const renderSeeds = () => {
//         if (seeds.length > 0) {
//             return seeds.map(seed => <PlaylistItem seed={seed}/>)
//         }
//     }


//     return (
//         <>
//             <div className="builder">
//                 {playlistBuild.name ? 
//                     <>
//                     <h3>{playlistBuild.name}</h3> 
//                     {seeds.length === 0 ? 
//                     renderSeeds() :
//                     <h3>Loading Seeds</h3>}
//                     </>
//                     :
//                     <h3>loading playlist builder</h3>
//                 }
//             </div>
//         </>
//     )
// }

// export default connect(msp)(PlaylistBuilder);


  
import React, {useState} from 'react';
import { connect } from 'react-redux';
import PlaylistItem from './PlaylistItem';
import {updatePlaylist} from '../Redux/actions'

const msp = (state) => {
  return {
    user: state.user,
    playlistBuild: state.playlistBuild,
    playlistSeeds: state.playlistSeeds,
  };
};

const PlaylistBuilder = ({ user, playlistBuild, playlistSeeds, updatePlaylist }) => {
  console.log('in playlistBuilder:', playlistBuild, playlistSeeds);

  let [{name}, setName] = useState({name: playlistBuild.name})
  let [titleEdit, setTitleEdit] = useState(false)

    const handleChange = (event) => {
      const { name, value } = event.target;
      setName((prevState) => ({ ...prevState, [name]: value }));
    };

    const keyPress = (e) => {
        if (e.key == 'Enter') {
            updatePlaylist(playlistBuild.id, "name", name)
            setTitleEdit(!titleEdit)
        }
    }

  const renderSeeds = () => {
    return playlistSeeds.map((seed) => <PlaylistItem seed={seed} playlistId={playlistBuild.id} />);
  };

  return (
    <>
      <div className="builder">
        {playlistBuild.name ? (
          <>
          {titleEdit ? 
          <input value={name} name="name" onChange={handleChange} onKeyDown={keyPress}></input>
          :
            <h3 onClick={()=> setTitleEdit(!titleEdit)}>{playlistBuild.name}</h3>
          }
            {renderSeeds()}
          </>
        ) : (
          <h3>loading playlist builder</h3>
        )}
      </div>
    </>
  );
};

export default connect(msp, {updatePlaylist})(PlaylistBuilder);