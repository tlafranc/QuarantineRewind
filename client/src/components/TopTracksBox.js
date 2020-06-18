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
                <div className="Title">
                    <h2 className="HeaderBlank">
                        {`My ${title} Rewind`}
                    </h2>
                    <h2 className="Header1">
                        {`My ${title} Rewind`}
                    </h2>
                    <h2 className="Header2">
                        {`My ${title} Rewind`}
                    </h2>
                    <h2 className="Header3">
                        {`My ${title} Rewind`}
                    </h2>
                </div>
                <div className="TopTracksInfo" style={{margin: `0 ${sideMargin}px 0 ${sideMargin}px`}}>
                    <h3>Top Artists</h3>
                    <TopArtists
                        artists={topArtists}
                        width={width}
                    />
                    <h3>Top Songs</h3>
                    <TopSongs
                        songs={_.slice(topSongs, 0, 5)}
                        width={width}
                    />
                    <h3 className="MoodGraphHeader">{`${title} Mood`}</h3>
                    <small className="MoodGraphTitle">Mood of My Most Played Songs</small>
                    
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
