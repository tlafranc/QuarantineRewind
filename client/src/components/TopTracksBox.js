// Import libraries
import React from 'react';
import _ from 'lodash';

// Import React Components
import MoodGraph from './MoodGraph.js';
import TopArtists from './TopArtists.js';
import TopSongs from './TopSongs.js';

// Import CSS
import './TopTracksBox.scss';

class TopTracksBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            
        };
    }

    render() {
        const { id, sideMargin, songValencesData, timeRange, title, topArtists, topSongs, width } = this.props;

        return (
            <div id={id} className="ShareBox">
                <h2 className="Title">
                    { title }
                </h2>
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
                    <h3 className="MoodGraphHeader">Quarantine Mood</h3>
                    <small className="MoodGraphTitle">Musical Positiveness Distribution of Your Top 50 Songs</small>
                    
                    <MoodGraph
                        songValencesData={songValencesData}
                        timeRange={timeRange}
                        width={width}
                    />
                </div>
            </div>
        );
    }
}

export default TopTracksBox;
