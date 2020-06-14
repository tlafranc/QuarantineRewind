// Import libraries
import React from 'react';
import _ from 'lodash';

// Import React Components
import ThreeImageLayout from './ThreeImageLayout.js';

// CSS
import './TopArtists.scss';

class TopArtists extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            
        };
    }

    render() {
        const { artists } = this.props;

        const artistItems = _(artists).map((artist) => {
            return (
                <div className="ArtistName" key={artist.name}>
                    {artist.name}
                </div>
            );
        }).value();

        const images = _(artists).map((artist) => {
            return {
                url: artist.images[0].url,
                alt: artist.name
            }
        }).value();

        return (
            <div className="TopArtists">
                <div className="ArtistNames" style={{width: `${this.props.width / 2 - 1}px`}}>
                    {artistItems}
                </div>
                <div className="ArtistImages" style={{width: `${this.props.width / 2 - 1}px`}}>
                    <ThreeImageLayout images={images} width={this.props.width / 2 - 1} />
                </div>
            </div>
        );
    }
}

export default TopArtists;