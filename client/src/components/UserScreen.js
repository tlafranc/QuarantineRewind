// Import libraries
import React from 'react';
import axios from 'axios';
import domtoimage from 'dom-to-image';

// Import React Components
import TopTracksBox from './TopTracksBox.js'

// Material UI
import Button from '@material-ui/core/Button';
import ShareIcon from '@material-ui/icons/Share';
// import Select from '@material-ui/core/Select';
// import InputLabel from '@material-ui/core/InputLabel';
// import MenuItem from '@material-ui/core/MenuItem';
// import FormControl from '@material-ui/core/FormControl';

// Import CSS
import './UserScreen.scss';

const userScreenId = "ShareBox";

class UserScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            timeRange: 'medium_term',
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
        const node = document.getElementById(userScreenId);
        const scale = 2;
        domtoimage.toPng(node, {
            height: node.offsetHeight * scale,
            style: {
              transform: `scale(${scale}) translate(${node.offsetWidth / 2 / scale}px, ${node.offsetHeight / 2 / scale}px)`
            },
            width: node.offsetWidth * scale
        }).then((dataUrl) => {
                let imageElement = document.createElement("img");  
                imageElement.src = dataUrl;
                imageElement.alt = "Your Quarantine Rewind";
                imageElement.width = node.offsetWidth;
                imageElement.height = node.offsetHeight;
                document.body.appendChild(imageElement);
            })
            .catch(function (error) {
                console.error('Dom To Image Error: ', error);
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
            <div className="UserScreen">
                {/* <FormControl>
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
                </FormControl> */}

                {topArtists 
                    ? <TopTracksBox id={userScreenId} dim={dim * 0.8} topArtists={topArtists} topSongs={topSongs} />
                    : null
                }

                <Button
                    className="ShareButton"
                    variant="contained"
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