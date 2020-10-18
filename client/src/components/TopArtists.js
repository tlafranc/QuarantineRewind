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
        const sideMargin = 16;
        const contentWidth = width - 2 * sideMargin;

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

        const leftSideWidth = contentWidth * .45 - 1
        const imageSize = (contentWidth - leftSideWidth) / 3;
        return (
            <div className="TopArtists" style={{ margin: `0 ${sideMargin}px` }}>
                <div id={`ArtistNames-${timeRange}`}className="ArtistNames" 
                    style={{ width: `${leftSideWidth}px`}}>
                    {artistItems}
                </div>
                <div className="ArtistImages" style={{width: `${imageSize * 3}px`, height: `${textHeight}px`}}>
                    <ThreeImageLayout images={images} width={imageSize} />
                </div>
            </div>
        );
    }
}

export default TopArtists;