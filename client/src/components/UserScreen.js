// Import libraries
import React from 'react';
import axios from 'axios';
import html2canvas from 'html2canvas';

// Import React Components
import TimeRangeSelect from './TimeRangeSelect.js';
import TopTracksBox from './TopTracksBox.js'

const userScreenId = "ShareBox";

class UserScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            topArtists: null,
            topSongs: null
        };
    }

    async componentDidMount() {
        const { accessToken } = this.props;

        if (accessToken) {
            try {
                const topArtists = (await axios.get('https://api.spotify.com/v1/me/top/artists?limit=3&time_range=short_term', {
                    headers: { 'Authorization': 'Bearer ' + accessToken }
                })).data.items;
                const topSongs = (await axios.get('https://api.spotify.com/v1/me/top/tracks?limit=5&time_range=short_term', {
                    headers: { 'Authorization': 'Bearer ' + accessToken }
                })).data.items;
                this.setState({
                    topArtists,
                    topSongs
                })
            } catch(e) {
                console.error(e);
            }
        }
    }

    share = () => {
		html2canvas(document.getElementById(userScreenId)).then(canvas => {
			console.log(canvas);
			const img = canvas.toDataURL()
			let imageElement = document.createElement("img");  
			imageElement.src = img;
			imageElement.alt = "Your Quarantine Rewind";
			imageElement.width = canvas.width / 2;
			imageElement.height = canvas.height / 2;
			document.body.appendChild(imageElement)
		});
	}

    render() {
        const { dim, accessToken } = this.props;
        const { topArtists, topSongs } = this.state;

        console.log(accessToken);
        return (
            <div>
                <TimeRangeSelect />
                {topArtists 
					? <TopTracksBox id={userScreenId} dim={dim} topArtists={topArtists} topSongs={topSongs} />
					: null
				}
                <button onClick={this.share}>
                    Share
                </button>
            </div>
        );
    }
}

export default UserScreen;