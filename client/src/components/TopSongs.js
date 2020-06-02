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
        const { songs } = this.props;
        const songItems = _(songs).map((song, i) => {
            return (
                <div className="Song" key={song.name}>
                    <img className="SongImage" src={song.album.images[2].url} alt={`${song.name}`} width={`${50}px`}/>
                    <div className="SongInfo">
                        <div className="SongName">{song.name}</div>
                        <div className="SongArtist">{song.artists[0].name}</div>
                    </div>
                </div>
            );
        }).value();

        return (
            <div>
                <ul>{songItems}</ul>
            </div>
        );
    }
}

export default TopSongs;