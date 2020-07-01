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
            textHeight: 0
        };
    }

    componentDidMount() {
        const { timeRange } = this.props;
        this.setState({
            textHeight: document.getElementById(`ArtistNames-${timeRange}`).clientHeight
        });
    }

    render() {
        const { artists, timeRange, width } = this.props;
        const { textHeight } = this.state;
        const marginLeft = 0;

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

        const imageSize = textHeight;

        return (
            <div className="TopArtists">
                <div id={`ArtistNames-${timeRange}`}className="ArtistNames" 
                    style={{ marginLeft: `${marginLeft}px`, width: `${width * .45 - marginLeft - 1}px`}}>
                    {artistItems}
                </div>
                <div className="ArtistImages" style={{width: `${imageSize * 3}px`}}>
                    <ThreeImageLayout images={images} width={imageSize} />
                </div>
            </div>
        );
    }
}

export default TopArtists;