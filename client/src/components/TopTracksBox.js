// Import libraries
import React from 'react';
import _ from 'lodash';

// Import React Components
import TopList from './TopList.js';
import TopArtists from './TopArtists.js';

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
        const logoSize = 28;

        topSongs = _.map(topSongs, (song) => {
            return song.name;
        });

        return (
            <div id={id}>
                <div className="ShareBoxHeader">
                    <img className="SpotifyLogo" src={SpotifyLogo} alt="Spotify Logo" width={`${logoSize}px`} />
                    <h2>My Quarantine Rewind</h2>
                </div>
                <div className="TopTracksInfo">
                    <div>Top Artists</div>
                    <TopArtists 
                        artists={topArtists}
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
