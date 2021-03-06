// Import libraries
import React from 'react';
import _ from 'lodash';

// Import React Components
import MoodGraph from './MoodGraph.js';
import ShearedTitle from './ShearedTitle.js';
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
                margin: `auto ${sideMargin}px`,
                fontSize: `${fontSize}px`
            }}>
                <ShearedTitle className="ShadowContainer Title" fontSize={fontSize} shadow={true} title={`My ${title} Rewind`} />
                <div className="TopTracksInfo" style={{margin: `0 ${sideMargin}px`}}>
                    <div className="ShadowContainer" style={{margin:`${fontSize * 3 / 4}px 0 ${fontSize / 2}px 0`}}>
                        <h3 className="ShadowBlank" style={{margin: 0}}>Top Artists</h3>
                        <h3 className="Shadow">Top Artists</h3>
                        <h3 className="ShadowMain">Top Artists</h3>
                    </div>
                    <TopArtists
                        artists={topArtists}
                        fontSize={fontSize}
                        timeRange={timeRange}
                        width={subContentWidth}
                    />
                    <div className="ShadowContainer" style={{margin: `${fontSize * 3 / 4}px 0 ${fontSize / 2}px 0`}}>
                        <h3 className="ShadowBlank" style={{margin: 0}}>Top Songs</h3>
                        <h3 className="Shadow">Top Songs</h3>
                        <h3 className="ShadowMain">Top Songs</h3>
                    </div>
                    <TopSongs
                        fontSize={fontSize}
                        songs={_.slice(topSongs, 0, 5)}
                        width={subContentWidth}
                    />
                    <div className="ShadowContainer" style={{margin: `0 0 ${fontSize / 8}px 0`}}>
                        <h3 className="ShadowBlank MoodGraphHeader">{`${title} Mood`}</h3>
                        <h3 className="Shadow">{`${title} Mood`}</h3>
                        <h3 className="ShadowMain">{`${title} Mood`}</h3>
                    </div>
                    <small className="MoodGraphTitle">Mood of My Most Played Songs</small>
                    
                    <MoodGraph
                        fontSize={fontSize}
                        songValencesData={songValencesData}
                        timeRange={timeRange}
                        width={subContentWidth}
                        height={0.19 * height}
                    />
                </div>
                <div id={`${timeRange}-url`} className="Smaller QrewindUrl">qrewind.com</div>
            </div>
        );
    }
}

export default TopTracksBox;
