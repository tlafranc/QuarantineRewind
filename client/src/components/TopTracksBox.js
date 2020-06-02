// Import libraries
import React from 'react';

// Import React Components
import TopArtists from './TopArtists.js';
import TopSongs from './TopSongs.js';

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
        const { dim, id, topArtists, topSongs } = this.props;
        const logoSize = 28;

        return (
            <div id={id}>
                <div className="ShareBoxHeader">
                    <img className="SpotifyLogo" src={SpotifyLogo} alt="Spotify Logo" width={`${logoSize}px`} />
                    <h2>My Quarantine Rewind</h2>
                </div>
                <div className="TopTracksInfo">
                    <h3>Top Artists</h3>
                    <TopArtists 
                        artists={topArtists}
                        dim={dim}
                    />
                    <h3>Top Songs</h3>
                    <TopSongs
                        songs={topSongs}
                    />
                </div>
            </div>
        );
    }
}

export default TopTracksBox;
