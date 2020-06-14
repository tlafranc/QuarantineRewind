// Import libraries
import React from 'react';
import _ from 'lodash';

// Import React Components
import MoodGraph from './MoodGraph.js';
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
        const { id, sideMargin, songValencesFreq, topArtists, topSongs, width } = this.props;
        const logoSize = 28;

        return (
            <div id={id}>
                <h2 className="Title" style={{marginLeft: `${2 * sideMargin}px`}}>
                    My Quarantine Rewind
                </h2>
                {/* <div className="ShareBoxHeader">
                    <img className="SpotifyLogo" src={SpotifyLogo} alt="Spotify Logo" width={`${logoSize}px`} />
                    <h2>My Quarantine Rewind</h2>
                </div> */}
                <div className="TopTracksInfo" style={{margin: `0 ${sideMargin}px 0 ${sideMargin}px`}}>
                    <h3>Top Artists</h3>
                    <TopArtists
                        artists={topArtists}
                        width={width}
                    />
                    <h3>Top Songs</h3>
                    <TopSongs
                        songs={_.slice(topSongs, 0, 5)}
                    />
                    <h3>Quarantine Mood</h3>
                    <MoodGraph
                        songValencesFreq={songValencesFreq}
                        width={width}
                    />
                </div>
            </div>
        );
    }
}

export default TopTracksBox;
