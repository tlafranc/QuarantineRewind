// Import libraries
import React from 'react';
import axios from 'axios';
import html2canvas from 'html2canvas';

// Import React Components
import TopTracksBox from './TopTracksBox.js'

// Material UI
import Button from '@material-ui/core/Button';
import ShareIcon from '@material-ui/icons/Share';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';

const userScreenId = "ShareBox";

class UserScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            timeRange: 'short_term',
            topArtists: null,
            topSongs: null
        };
    }

    async componentDidMount() {
        const { accessToken } = this.props;

        if (accessToken) {
            try {
                const topArtists = await this.getTopArtists();
                const topSongs = await this.getTopSongs();
                this.setState({
                    topArtists,
                    topSongs
                })
            } catch(e) {
                console.error(e);
            }
        }
    }

    getTopArtists = async (timeRange=this.state.timeRange) => {
        return (await axios.get(`https://api.spotify.com/v1/me/top/artists?limit=3&time_range=${timeRange}`, {
            headers: { 'Authorization': `Bearer ${this.props.accessToken}` }
        })).data.items;
    }

    getTopSongs = async (timeRange=this.state.timeRange) => {
        return (await axios.get(`https://api.spotify.com/v1/me/top/tracks?limit=5&time_range=${timeRange}`, {
            headers: { 'Authorization': `Bearer ${this.props.accessToken}` }
        })).data.items;
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
    
    timeRangeChange = async (event) => {
        const topArtists = await this.getTopArtists(event.target.value);
        const topSongs = await this.getTopSongs(event.target.value);
        this.setState({
            timeRange: event.target.value,
            topArtists,
            topSongs
        });
    };

    render() {
        const { dim } = this.props;
        const { timeRange, topArtists, topSongs } = this.state;

        return (
            <div>
                <FormControl>
                    <InputLabel>Time Range</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={timeRange}
                        onChange={this.timeRangeChange}
                    >
                        <MenuItem value={"short_term"}>4 Weeks</MenuItem>
                        <MenuItem value={"medium_term"}>6 Months</MenuItem>
                        <MenuItem value={"long_term"}>Lifetime</MenuItem>
                    </Select>
                </FormControl>

                {topArtists 
					? <TopTracksBox id={userScreenId} dim={dim} topArtists={topArtists} topSongs={topSongs} />
					: null
				}

                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<ShareIcon />}
                    onClick={this.share}
                >
                    Share
                </Button>
            </div>
        );
    }
}

export default UserScreen;