## Perfect Playlist

Perfect Playlist is a web app that allows users to generate parametric playlists and publish them to their Spotify profile. This is my first 'real' project and is a work in progress. Currently it is **not** mobiile friendly and requires a **premium** Spotify account to work!!

Check out the deployed version:

[Perfect Playlist](https://playlister-frontend.herokuapp.com/)

## Running it Locally

First, fork & clone the [backend](https://github.com/bryanmoon1991/playlister-backend) and follow the directions there.
Then simply

```bash
npm install
npm start
```

## Usage

Items are added to a build and playlists are generated from the items added. Users can control their Spotify profiles by either 'following' or 'favoriting' items as they navigate through different item profiles. Once a desired amount of items are added into the build, users can preview the playlist that is generated from those items and publish the playlist to their Spotify profile. There are three additional parameters a user can adjust that will influence the aural quality of the playlist. The three parameters are **energy, mood, & instrumental** and correspond to audio qualities characterized by Spotify's internal audio analysis.

- energy

  - loudness
  - danceability
  - tempo
  - energy

- mood

  - mode
  - valence

- instrumental
  - instrumentalness

You can learn more about how Spotify's audio analysis works [here](https://developer.spotify.com/documentation/web-api/reference/#object-audiofeaturesobject)

Note that if the item that is added to the build is a 'track' then the track is guaranteed to appear in the playlist that is generated.

Check out the video demo [here](https://youtu.be/50RBJrqYr2c)

## Credit

This project is essentially a clone of the amazing [Discover Quickly](discoverquickly.com) project built by [Aliza Aufrichtig](https://github.com/alizauf) and [Edward Lee](http://edwardclementlee.com/). I chose to build my own version to help me gain a better understanding of React & Redux and because I loved using the original so much. I wanted to challenge myself by building a clone of something just through using it.

I also found an extremely useful client-side [wrapper](https://github.com/JMPerez/spotify-web-api-js) that made working with the Spotify API quick and painless. Thanks [JMPerez](https://github.com/JMPerez/) for making such a useful tool!

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
