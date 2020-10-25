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
        const { fontSize, songs, width } = this.props;
        const sidePadding = fontSize;
        const contentWidth = width - 2 * sidePadding;
        const imageSize = 2 * fontSize + 4;

        const songItems = _(songs).map((song, i) => {
            return (
                <div className="Song" key={song.name} style={{paddingBottom: `${fontSize / 2}px`}}>
                    <img 
                        className="SongImage" 
                        src={song.album.images[0].url} 
                        alt={`${song.name}`} 
                        width={`${imageSize}px`} 
                        height={`${imageSize}px`} />
                    <div className="SongInfo" style={{ width: 0.8 * contentWidth, height: `${imageSize}px` }}>
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