import React from 'react';
import SpotifyLogo from '../images/SpotifyLogo.png';

class TopTracksInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            
        };
    }

    render() {
        return (
            <svg className={this.props.className} width="500px" height="500px">
                <image href={SpotifyLogo} width="20px" height="20px" />
                <text x="20" y="15" fill="red">Top Artists</text>
                <text x="120" y="15" fill="red">Top Songs</text>
            </svg>
        );
    }
}

export default TopTracksInfo;