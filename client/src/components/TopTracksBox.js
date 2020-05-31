// Import libraries
import React from 'react';
import _ from 'lodash';

// Import React Components
import TopList from './TopList.js';

// Import CSS and photos
import './TopTracksBox.scss';
import SpotifyLogo from '../images/SpotifyLogo.png';

class TopTracksBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            
        };
    }

    render() {
        let { dim, id, topArtists, topSongs } = this.props;
        const logoSize = 20;

        topArtists = _.map(topArtists, (artist) => {
            return artist.name;
        });
        topSongs = _.map(topSongs, (song) => {
            return song.name;
        });

        return (
            <div id={id}>
                <div className="ShareBoxHeader">
                    <img className="SpotifyLogo" src={SpotifyLogo} alt="Spotify Logo" width={`${logoSize}px`} />
                    <h3>My Quarantine Rewind</h3>
                </div>
                <div className="TopTracksInfo">
                    <div>Top Artists</div>
                    <TopList 
                        list={topArtists}
                    />
                    <div>Top Songs</div>
                    <TopList
                        list={topSongs}
                    />
                </div>
            </div>
        );
    }
}

export default TopTracksBox;
