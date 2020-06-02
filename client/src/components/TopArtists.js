// Import libraries
import React from 'react';
import _ from 'lodash';

// Material UI
import StarIcon from '@material-ui/icons/Star';

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

        const artistItems = _(artists).map((artist, i) => {
            const stars = [];
            _.times(i + 1, (j) => {
                stars.push(<StarIcon key={`Star_${j}_for_${artist.name}`}/>);
            });

            return (
                <div className="Artist" key={artist.name} style={{width: `${this.props.dim / 3 - 1}px`}}>
                    <img className="ArtistImage" src={artist.images[2].url} alt={`${artist.name}`} width={`${50}px`}/>
                    <div className="ArtistName">{artist.name}</div>
                    {stars}
                </div>
            );
        }).value();

        return (
            <div className="TopArtists">
                {artistItems}
            </div>
        );
    }
}

export default TopArtists;