// Import libraries
import React from 'react';
import _ from 'lodash';

// CSS
import './TopSongs.scss'

class TopSongs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            
        };
    }

    render() {
        const { songs, width } = this.props;
        const sidePadding = 16;
        const contentWidth = width - 2 * sidePadding;
        const imageSize = 40;

        const songItems = _(songs).map((song, i) => {
            return (
                <div className="Song" key={song.name}>
                    <img 
                        className="SongImage" 
                        src={song.album.images[0].url} 
                        alt={`${song.name}`} 
                        width={`${imageSize}px`} 
                        height={`${imageSize}px`} />
                    <div className="SongInfo" style={{ width: 0.8 * contentWidth, height: `${imageSize - 4}px` }}>
                        <div className="SongName">{song.name}</div>
                        <div className="SongArtist">{song.artists[0].name}</div>
                    </div>
                </div>
            );
        }).value();

        return (
            <div style={{padding: `0 ${sidePadding}px`}}>
                {songItems}
            </div>
        );
    }
}

export default TopSongs;