import React from 'react';
import _ from 'lodash';

import TopList from './TopList.js';

import SpotifyLogo from '../images/SpotifyLogo.png';

class TopTracksInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dim: Math.min(Math.min(window.innerWidth, window.innerHeight) * 0.8, 1000)
        };
    }

    componentDidMount() {
        window.addEventListener('resize', this.updateDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
    }

    updateDimensions = _.throttle(() => {
        this.setState({
            dim: Math.min(window.innerWidth * 0.8, 1000)
        });
    }, 100)

    render() {
        const { dim } = this.state;
        const logoSize = dim * 0.1;
        const topSongOffset = (dim - logoSize - 10) * 0.5;

        return (
            <svg className={this.props.className} width={`${dim}px`} height={`${dim}px`}>
                <image href={SpotifyLogo} width={`${logoSize}px`} height={`${logoSize}px`} />
                <g style={{transform: `translate(${logoSize + 10}px,${logoSize}px)`}}>
                    <g id="TopArtists">
                        <text x="0" y="0" fill="red">Top Artists</text>
                        <TopList 
                            list={['Travis Scott', 'Kanye West', 'Kendrick Lamar', 'The Weekdnd', 'Frank Ocean']}
                            style={{transform: `translate(0px, ${32}px)`}}
                        />
                    </g>
                    <g id="TopSongs" style={{transform: `translate(0px, 200px)`}}>
                        <text x="0" y="0" fill="red">Top Songs</text>
                        <TopList
                            list={['Astroworld', 'My Beautiful Dark Twisted Fantasy', 'good kid, m.A.A.d city (Deluxe)', 'After Hours (Deluxe)', 'Chanel Orange']}
                            style={{transform: `translate(0px, ${32}px)`}} 
                        />
                    </g>
                </g>
            </svg>
        );
    }
}

export default TopTracksInfo;