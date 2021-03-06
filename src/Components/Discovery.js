import React, { useEffect } from "react"
import { connect } from "react-redux"
import { Loader } from "semantic-ui-react"
import ArtistBubble from "./ArtistBubble"
import Card from "./Card"
import Controls from "./Controls"
import "../Styles/Discovery.css"
import { Toaster } from "react-hot-toast"

import {
  saveNotify,
  unsaveNotify,
  followNotify,
  unfollowNotify,
  addToBuildNotify,
} from "./utils"

const msp = (state) => {
  return {
    relatedArtists: state.relatedArtists,
  }
}

const Discovery = ({ relatedArtists, spotifyApi }) => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const renderArtistBubbles = () => {
    return relatedArtists.artists.map((artist, i) => (
      <ArtistBubble
        artist={artist}
        key={artist.id}
        spotifyApi={spotifyApi}
        followNotify={followNotify}
        unfollowNotify={unfollowNotify}
        position={i}
      />
    ))
  }

  return (
    <>
      <div className="discovery-tool">
        {relatedArtists.artists ? (
          <>
            <div className="stack">
              <Controls spotifyApi={spotifyApi} />
              <Card
                spotifyApi={spotifyApi}
                followNotify={followNotify}
                unfollowNotify={unfollowNotify}
                saveNotify={saveNotify}
                unsaveNotify={unsaveNotify}
                addToBuildNotify={addToBuildNotify}
              />
            </div>
            <div className="bubbles">
              <p>Related Artists:</p>
              {renderArtistBubbles()}
            </div>
            <Toaster />
          </>
        ) : (
          <Loader active inline="centered" />
        )}
      </div>
    </>
  )
}

export default connect(msp)(Discovery)
