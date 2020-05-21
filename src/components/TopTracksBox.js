// Import libraries
import React from 'react';

// Import React Components
import TopTracksInfo from './TopTracksInfo.js';

// Import CSS and photos
import './TopTracksBox.css';
import SpotifyLogo from '../images/SpotifyLogo.png';

class TopTracksBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            
        };
    }

    render() {
        const { dim } = this.props;
        const logoSize = dim * 0.1;

        return (
            <div>
                <img src={SpotifyLogo} width={`${logoSize}px`} />
                <TopTracksInfo className="TopTracksInfo" />
            </div>
        );
    }
}

export default TopTracksBox;
