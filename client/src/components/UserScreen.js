// Import libraries
import React from 'react';
import axios from 'axios';
import domtoimage from 'dom-to-image';
import _ from 'lodash';

// Import React Components
import TopTracksBox from './TopTracksBox.js'

// Material UI
import ShareIcon from '@material-ui/icons/Share';
import FastRewindIcon from '@material-ui/icons/FastRewind';
import FastForwardIcon from '@material-ui/icons/FastForward';

// Import CSS
import './UserScreen.scss';

const userScreenId = "ShareBox";
const timeRanges = ["long_term", "medium_term", "short_term"];
const timeRangeToShift = {
    "short_term": {
        "short_term": -2,
        "medium_term": -2,
        "long_term": 1
    },
    "medium_term": {
        "short_term": -1,
        "medium_term": -1,
        "long_term": -1
    },
    "long_term": {
        "short_term": -3,
        "medium_term": 0,
        "long_term": 0
    }
}
const timeRangeToTitle = {
    "short_term": "Monthly",
    "medium_term": "Quarantine",
    "long_term": "Lifetime"
}
const rewindTimeRangeToZIndex = {
    "short_term": {
        "short_term": 3,
        "medium_term": 1,
        "long_term": 2
    },
    "medium_term": {
        "short_term": 2,
        "medium_term": 3,
        "long_term": 1
    },
    "long_term": {
        "short_term": 1,
        "medium_term": 2,
        "long_term": 3
    }
}
const forwardTimeRangeToZIndex = {
    "short_term": {
        "short_term": 3,
        "medium_term": 2,
        "long_term": 1
    },
    "medium_term": {
        "short_term": 1,
        "medium_term": 3,
        "long_term": 2
    },
    "long_term": {
        "short_term": 2,
        "medium_term": 1,
        "long_term": 3
    }
}

class UserScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lastAction: null,
            timeRangeIndex: 1,
            songValencesData: null,
            topArtists: null,
            topSongs: null
        };
    }

    async componentDidMount() {
        const topArtists = await this.getTopArtists();
        const topSongs = await this.getTopSongs();
        const songValencesData = await Promise.all(_.map(topSongs, async (topSongsList) => {
            return await this.getSongValencesData(topSongsList); 
        }));

        this.setState({
            songValencesData,
            topArtists,
            topSongs
        });
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
            if (valence === 1) {
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
            width: node.offsetWidth * scale,
            style: {
                transform: `scale(${scale})`,
                transformOrigin: "top left",
                width: `${node.offsetWidth}px`,
                height: `${node.offsetHeight}px`
            }
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

    rewind = _.throttle(() => {
        const { timeRangeIndex } = this.state;

        this.setState({
            lastAction: 'rewind',
            timeRangeIndex: timeRangeIndex === 0 ? timeRanges.length - 1 : timeRangeIndex - 1
        });
    }, 250, { trailing: false });

    forward = _.throttle(() => {
        const { timeRangeIndex } = this.state;

        this.setState({
            lastAction: 'forward',
            timeRangeIndex: timeRangeIndex === timeRanges.length - 1 ? 0 : timeRangeIndex + 1
        });
    }, 250, { trailing: false });

    render() {
        const { height, combinedWidth, slideWidth } = this.props;
        const { lastAction, songValencesData, timeRangeIndex, topArtists, topSongs } = this.state;
        
        const activeTimeRange = timeRanges[timeRangeIndex];
        const topTracksBoxesShift = timeRangeToShift[activeTimeRange];

        const zIndexMapConstants = lastAction === 'forward' ? forwardTimeRangeToZIndex : rewindTimeRangeToZIndex;
        const zIndexMap = zIndexMapConstants[activeTimeRange];

        const topTracksBoxes = songValencesData 
            ? _.map(timeRanges, (timeRange, i) => {
                return (
                    <TopTracksBox
                        key={timeRange}
                        id={`${userScreenId}-${timeRange}`} 
                        height={ (i === timeRangeIndex ? 1 : 0.9) * height }
                        songValencesData={songValencesData[i]}
                        style={{
                            transform: `translate(${topTracksBoxesShift[timeRange] * slideWidth}px, 0)`,
                            zIndex: zIndexMap[timeRange]
                        }}
                        timeRange={timeRange}
                        title={timeRangeToTitle[timeRange]}
                        topArtists={topArtists[i]} 
                        topSongs={topSongs[i]}
                        width={slideWidth} />
                );
            })
            : null;

        const leftShift = (combinedWidth - slideWidth) / 2;

        return (
            <div className="UserScreen">
                <div className="TopTrackBoxesContainer" style={{transform: `translate(${leftShift}px, 0)`}}>
                    { topTracksBoxes }
                </div>

                {!songValencesData ? null : 
                    <div className="UserScreenButtons" style={{width: `${combinedWidth}px`}}>
                        <div className="RewindTimeRangeIcon"
                            onClick={this.rewind}>
                            <small className="IconLabel">
                                {timeRangeIndex === 0
                                    ? timeRangeToTitle[timeRanges[timeRanges.length - 1]]
                                    : timeRangeToTitle[timeRanges[timeRangeIndex - 1]]
                                }
                            </small>
                            <FastRewindIcon className="IconButton" fontSize="large" />
                        </div>
                        <div className="ShareIcon" onClick={this.share}>
                            <small className="IconLabel">Share</small>
                            <ShareIcon className="IconButton" fontSize="large" />
                        </div>
                        <div className="ForwardTimeRangeIcon"
                            onClick={this.forward}>
                            <small className="IconLabel">
                                {timeRangeIndex === timeRanges.length - 1
                                    ? timeRangeToTitle[timeRanges[0]]
                                    : timeRangeToTitle[timeRanges[timeRangeIndex + 1]]
                                }
                            </small>
                            <FastForwardIcon className="IconButton" fontSize="large" />
                        </div>
                    </div>
                }
            </div>
        );
    }
}

export default UserScreen;