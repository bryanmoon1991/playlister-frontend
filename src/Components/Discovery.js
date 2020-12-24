import React from 'react'
import { connect } from 'react-redux';
import ArtistBubble from './ArtistBubble';
import ArtistCard from './ArtistCard'
import '../Styles/Discovery.css'

const msp = state => {
    return {
        relatedArtists: state.relatedArtists,
    }
}

const Discovery = ({relatedArtists, spotifyApi}) => {
    console.log("in discovery", spotifyApi)

    const renderArtistBubbles = () => {
        // let results = [] 
        // let j = 5
        // for (let i = 0; i < j; i++) {
        //    let artist = relatedArtists.artists[i] 
        //    artist.images ?
        //    results.push(<ArtistBubble artist={artist} key={artist.id} spotifyApi={spotifyApi}/>) :
        //    j++
        // }
        // return results
        return relatedArtists.artists.map((artist) => (
          <ArtistBubble
            artist={artist}
            key={artist.id}
            spotifyApi={spotifyApi}
          />
        ));
    }

    return (
        <>
        <div className="discovery-tool">
            {relatedArtists.artists ? 
            <>
            <div className="artist-card">
                <ArtistCard spotifyApi={spotifyApi}/>
            </div>
            <div className="bubbles">
                {renderArtistBubbles()} 
            </div>
            </> :
            <h2>loading discovery tool</h2>
            }
        </div>
        </>
    )
}

export default connect(msp)(Discovery)