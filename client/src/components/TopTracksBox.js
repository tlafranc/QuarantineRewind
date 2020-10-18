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
        const {
            height, 
            id, 
            fontSize,
            sideMargin,
            subSideMargin,
            songValencesData, 
            style,
            timeRange, 
            title, 
            topArtists, 
            topSongs, 
            width 
        } = this.props;
        const contentWidth = width - 2 * sideMargin;
        const subContentWidth = contentWidth - 2 * subSideMargin;

        return (
            <div id={id} className="ShareBox" style={{ 
                ...style,
                height: `${height}px`, 
                width: `${contentWidth}px`, 
                margin: `auto ${sideMargin}px` 
            }}>
                <div className="Title" style={{paddingTop: 0, marginTop: `${fontSize}px`}}>
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
                <div className="TopTracksInfo" style={{margin: `0 ${sideMargin}px`}}>
                    <h3 style={{margin:`${fontSize / 2}px 0`}}>Top Artists</h3>
                    <TopArtists
                        artists={topArtists}
                        timeRange={timeRange}
                        width={subContentWidth}
                    />
                    <h3 style={{margin:`${fontSize / 2}px 0`}}>Top Songs</h3>
                    <TopSongs
                        fontSize={fontSize}
                        songs={_.slice(topSongs, 0, 5)}
                        width={subContentWidth}
                    />
                    <h3 className="MoodGraphHeader">{`${title} Mood`}</h3>
                    <small className="MoodGraphTitle">Mood of My Most Played Songs</small>
                    
                    <MoodGraph
                        songValencesData={songValencesData}
                        timeRange={timeRange}
                        width={subContentWidth}
                        height={0.18 * height}
                    />
                </div>
            </div>
        );
    }
}

export default TopTracksBox;
