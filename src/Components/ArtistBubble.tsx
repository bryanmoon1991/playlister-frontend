import { useEffect, useState } from 'react'
import { Grid, Popup, Button, Header } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { createNext } from '../Redux/actions'
import '../Styles/ArtistBubble.css'

import { followNotify, unfollowNotify } from './utils'
import { Artist, SpotifyResponse } from '../types'

interface Props {
  artist: Artist
  spotifyApi: any
  createNext: Function
  position: number
}

interface TrackInfo {
  name: string
  title: string
}

// Util to add context to an implicit truthiness check
const hasTracks = (data: SpotifyResponse) => !!data.tracks[0]
const getFirstTrack = (data: SpotifyResponse) => data.tracks[0]

const ArtistBubble = ({ artist, spotifyApi, createNext, position }: Props) => {
  const initialInfo = { name: '', title: '' }

  let [preview, setPreview] = useState<HTMLAudioElement>()
  let [info, setInfo] = useState<TrackInfo>(initialInfo)

  useEffect(() => {
    const { id, name } = artist

    spotifyApi.getArtistTopTracks(id, 'US').then((data: SpotifyResponse) => {
      const track = getFirstTrack(data)

      if (hasTracks(data)) {
        setPreview(new Audio(track.preview_url))
        setInfo({ name, title: track.name })
      } else {
        setInfo({ name, title: 'Sorry, there is no preview' })
      }
    })

    return () => {
      setPreview(undefined)
      setInfo(initialInfo)
    }
  }, [artist, spotifyApi, initialInfo])

  const playPreview = () => {
    if (preview) {
      let playPromise = preview.play()
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('playing')
          })
          .catch(() => {
            console.log('no preview available')
          })
      }
    } else {
      console.log('no preview for this artist')
    }
  }

  const stopPreview = () => {
    if (preview) {
      preview.pause()
      preview.currentTime = 0
    }
  }

  // Object destructuring for some cleaner TSX
  const { name, title } = info
  const { id, images, external_urls } = artist
  const imageURL = images[0]
    ? images[0].url
    : 'https://reactnativecode.com/wp-content/uploads/2018/02/Default_Image_Thumbnail.png'

  return (
    <>
      <Popup
        size="mini"
        position={position % 2 ? 'right center' : 'left center'}
        hoverable
        hideOnScroll
        trigger={
          <div
            style={{
              backgroundImage: `url(${imageURL})`,
              backgroundSize: 'cover',
              height: '50px',
              width: '50px',
              borderRadius: '50%',
            }}
            onMouseEnter={() => playPreview()}
            onMouseLeave={() => stopPreview()}
            onWheel={() => stopPreview()}
            className="bubble"
            onClick={() => {
              createNext(artist, spotifyApi)
              stopPreview()
            }}
          />
        }
      >
        <Grid columns={1}>
          <Grid.Column textAlign="left">
            <Header as="h4">{`Artist: ${name}`}</Header>
            <p>{`Top Track: ${title}`}</p>
            <Button.Group>
              <Popup
                mouseEnterDelay={500}
                position="bottom center"
                size="mini"
                content={
                  artist.following
                    ? `Unfollow ${name} on Spotify`
                    : `Follow ${name} on Spotify`
                }
                trigger={
                  artist.following ? (
                    <Button
                      icon="user times"
                      size="mini"
                      onClick={() => {
                        spotifyApi.unfollowArtists([id])
                        unfollowNotify(name)
                      }}
                    />
                  ) : (
                    <Button
                      icon="user plus"
                      size="mini"
                      onClick={() => {
                        spotifyApi.followArtists([id])
                        followNotify(name)
                      }}
                    />
                  )
                }
              />
              <Popup
                mouseEnterDelay={500}
                position="bottom center"
                size="mini"
                content="Open in Spotify"
                trigger={
                  <Button
                    as="a"
                    target="_blank"
                    href={external_urls.spotify}
                    icon="spotify"
                    size="mini"
                  />
                }
              />
            </Button.Group>
          </Grid.Column>
        </Grid>
      </Popup>
    </>
  )
}

export default connect(null, { createNext })(ArtistBubble)
