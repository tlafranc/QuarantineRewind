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
import FastRewindIcon from '@material-ui/icons/FastRewind';
import FastForwardIcon from '@material-ui/icons/FastForward';

// Import CSS
import './UserScreen.scss';

const userScreenId = "ShareBox";
const timeRanges = ["short_term", "medium_term", "long_term"];
const timeRangeToShift = {
    "short_term": 0,
    "medium_term": -1,
    "long_term": -2
}
const timeRangeToTitle = {
    "short_term": "My Monthly Rewind",
    "medium_term": "My Quarantine Rewind",
    "long_term": "My Lifetime Rewind"
}

class UserScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            timeRangeIndex: 1,
            songValencesData: null,
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
                const songValencesData = await Promise.all(_.map(topSongs, async (topSongsList) => {
                    return await this.getSongValencesData(topSongsList); 
                }));

                this.setState({
                    songValencesData,
                    topArtists,
                    topSongs
                })
            } catch(e) {
                console.error(e);
            }
        }
    }

    getTopArtists = async () => {
        return await Promise.all(_.map(timeRanges, async (timeRange) => {
            return (await axios.get(`https://api.spotify.com/v1/me/top/artists?limit=3&time_range=${timeRange}`, {
                headers: { 'Authorization': `Bearer ${this.props.accessToken}` }
            })).data.items;
        }));
    }

    getTopSongs = async () => {
        return await Promise.all(_.map(timeRanges, async (timeRange) => {
            return (await axios.get(`https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=${timeRange}`, {
                headers: { 'Authorization': `Bearer ${this.props.accessToken}` }
            })).data.items;
        }));
    }

    getSongValencesData = async (songs) => {
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
                freqArray[Math.floor(valence / binSize)] += 1;
            }
        });
        
        const numBins = 60;
        let medianValence = _.sum(songValences) / songValences.length;
        medianValence = Math.floor(medianValence * (numBins * binSize) / binSize);

        return {
            freqArray,
            medianValence,
            numBins
        };
    }

    share = () => {
        const { timeRangeIndex } = this.state;
        const node = document.getElementById(`${userScreenId}-${timeRanges[timeRangeIndex]}`);
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

    rewind = () => {
        const { timeRangeIndex } = this.state;

        this.setState({
            timeRangeIndex: timeRangeIndex - 1
        });
    }

    forward = () => {
        const { timeRangeIndex } = this.state;

        this.setState({
            timeRangeIndex: timeRangeIndex + 1
        });
    } 

    render() {
        const { width } = this.props;
        const { songValencesData, timeRangeIndex, topArtists, topSongs } = this.state;
        const sideMargin = 16;
        const timeRange = timeRanges[timeRangeIndex];
        const topTracksBoxesShift = timeRangeToShift[timeRange];

        const topTracksBoxes = songValencesData 
            ? _.map(timeRanges, (timeRange, i) => {
                return (
                    <TopTracksBox
                        key={timeRange}
                        id={`${userScreenId}-${timeRange}`} 
                        sideMargin={sideMargin}
                        songValencesData={songValencesData[i]}
                        timeRange={timeRange}
                        title={timeRangeToTitle[timeRange]}
                        topArtists={topArtists[i]} 
                        topSongs={topSongs[i]}
                        width={width - 2 * sideMargin} />
                );
            })
            : null;

        return (
            <div className="UserScreen">
                <div className={`RewindTimeRangeIcon ${timeRangeIndex == 0 ? 'disabled' : ''}`}
                    onClick={this.rewind}>
                    <small className="IconLabel">Prev</small>
                    <FastRewindIcon className="IconButton" fontSize="large" />
                </div>
                <div className={`ForwardTimeRangeIcon ${timeRangeIndex == timeRanges.length - 1 ? 'disabled' : ''}`}
                    onClick={this.forward}>
                    <small className="IconLabel">Next</small>
                    <FastForwardIcon className="IconButton" fontSize="large" />
                </div>

                <div className="TopTrackBoxesContainer" style={{transform: `translate(${topTracksBoxesShift * width}px, 0)`}}>
                    { topTracksBoxes }
                </div>

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