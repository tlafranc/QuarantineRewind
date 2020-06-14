// Import libraries
import React from 'react';
import axios from 'axios';
import domtoimage from 'dom-to-image';
import _ from 'lodash';

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
            songValencesFreq: null,
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
                const songValencesFreq = await this.getSongValencesFreq(topSongs); 
                this.setState({
                    songValencesFreq,
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
        return (await axios.get(`https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=${timeRange}`, {
            headers: { 'Authorization': `Bearer ${this.props.accessToken}` }
        })).data.items;
    }

    getSongValencesFreq = async (songs) => {
        const songIds = _(songs).map((song) => {
            return song.id;
        }).value();
        const songFeatures = (await axios.get(`https://api.spotify.com/v1/audio-features/?ids=${songIds.join()}`, {
                headers: { 'Authorization': `Bearer ${this.props.accessToken}`}
            })).data.audio_features;
        const songValences = _(songFeatures).map((song) => {
            return song.valence;
        }).value();

        // Arbitrary bin size of 0.05
        const binSize = 0.05;
        const freqArray = _.fill(Array(1 / binSize), 0);
        _(songValences).forEach((valence) => {
            if (valence == 1) {
                freqArray[freqArray.length - 1] += 1;
            } else {
                freqArray[Math.floor(valence * (1 / binSize))] += 1;
            }
        });

        return freqArray;
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
        const songValencesFreq = await this.getSongValencesFreq(topSongs);
        this.setState({
            songValencesFreq,
            timeRange: event.target.value,
            topArtists,
            topSongs
        });
    };

    render() {
        const { width } = this.props;
        const { songValencesFreq, timeRange, topArtists, topSongs } = this.state;
        const sideMargin = 16;

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

                {songValencesFreq 
                    ? <TopTracksBox
                        id={userScreenId} 
                        sideMargin={sideMargin}
                        songValencesFreq={songValencesFreq}
                        topArtists={topArtists} 
                        topSongs={topSongs}
                        width={width - 2 * sideMargin}  />
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