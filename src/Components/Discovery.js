import React from 'react'
import { connect } from 'react-redux';
import ArtistBubble from './ArtistBubble';
import Card from './Card'
import '../Styles/Discovery.css'

const msp = state => {
    return {
        relatedArtists: state.relatedArtists,
    }
}

const Discovery = ({relatedArtists, spotifyApi}) => {
    console.log("in discovery", spotifyApi)

    const renderArtistBubbles = () => {
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
            <div className="stack">
                <Card spotifyApi={spotifyApi}/>
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