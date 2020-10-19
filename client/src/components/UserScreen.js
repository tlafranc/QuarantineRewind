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
import Modal from '@material-ui/core/Modal';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import Button from '@material-ui/core/Button';

// Import CSS
import './UserScreen.scss';

const userScreenId = "ShareBox";
const timeRanges = ["long_term", "medium_term", "short_term"];
const timeRangeToShift = {
    "short_term": {
        "short_term": {short: -2, regular: 0},
        "medium_term": {short: -2, regular: 0},
        "long_term": {short: 0, regular: 1}
    },
    "medium_term": {
        "short_term": {short: -1, regular: 0},
        "medium_term": {short: -1, regular: 0},
        "long_term": {short: -1, regular: 0}
    },
    "long_term": {
        "short_term": {short: -2, regular: -1},
        "medium_term": {short: 0, regular: 0},
        "long_term": {short: 0, regular: 0}
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
            helpModalOpen: true,
            shareModalOpen: false,
            timeRangeIndex: 1,
            songValencesData: null,
            topArtists: null,
            topSongs: null
        };
    }

    async componentDidMount() {
        const topArtists = await Promise.all(_.map(timeRanges, async (timeRange) => {
            return (await this.spotifyRequest(`https://api.spotify.com/v1/me/top/artists?limit=3&time_range=${timeRange}`)).data.items;
        }));
        const topSongs = await Promise.all(_.map(timeRanges, async (timeRange) => {
            return (await this.spotifyRequest(`https://api.spotify.com/v1/me/top/tracks?limit=25&time_range=${timeRange}`)).data.items;
        }));
        const songValencesData = await Promise.all(_.map(topSongs, async (topSongsList) => {
            return await this.getSongValencesData(topSongsList); 
        }));

        this.setState({
            songValencesData,
            topArtists,
            topSongs
        });
    }

    spotifyRequest = async (url) => {
        try {
            return (await axios.get(url, {
                headers: { 'Authorization': `Bearer ${this.props.accessToken}` }
            }));
        } catch (err) {
            let statusCode = err.response.status;
            if (statusCode === 429) {
                await (new Promise((resolve) => {
                    setTimeout(() => {
                        resolve();
                    }, err.response.headers['retry-after'] * 1000);
                }));
                return await this.spotifyRequest(url);
            }
        }
    }

    getSongValencesData = async (songs) => {
        const songIds = _(songs).map((song) => {
            return song.id;
        }).value();

        const songFeatures = (await this.spotifyRequest(`https://api.spotify.com/v1/audio-features/?ids=${songIds.join()}`)).data.audio_features;
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

    share = async () => {
        const { timeRangeIndex } = this.state;
        const node = document.getElementById(`${userScreenId}-${timeRanges[timeRangeIndex]}`);
        const scale = 2;
        await domtoimage.toPng(node, {
            height: node.offsetHeight * scale,
            width: node.offsetWidth * scale,
            style: {
                transform: `scale(${scale})`,
                transformOrigin: "top left",
                width: `${node.offsetWidth}px`,
                height: `${node.offsetHeight}px`
            }
        });

        this.setState({
            shareModalOpen: true
        }, () => {
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
                    imageElement.width = node.offsetWidth - 40;
                    let imageContainer = document.getElementsByClassName('ShareModal')[0];
                    imageContainer.appendChild(imageElement);
                })
                .catch(function (error) {
                    console.error('Dom To Image Error: ', error);
                });
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

    openHelpModal = () => {
        this.setState({
            helpModalOpen: true
        });
    };
    closeHelpModal = () => {
        this.setState({
            helpModalOpen: false
        });
    };
    openShareModal = () => {
        this.setState({
            shareModalOpen: true
        });
    };
    closeShareModal = () => {
        this.setState({
            shareModalOpen: false
        });
    };

    render() {
        const { height, slideWidth, fontSize } = this.props;
        const { lastAction, helpModalOpen, shareModalOpen, songValencesData, timeRangeIndex, topArtists, topSongs } = this.state;
        
        const activeTimeRange = timeRanges[timeRangeIndex];
        const topTracksBoxesShift = timeRangeToShift[activeTimeRange];

        const zIndexMapConstants = lastAction === 'forward' ? forwardTimeRangeToZIndex : rewindTimeRangeToZIndex;
        const zIndexMap = zIndexMapConstants[activeTimeRange];

        const sizeReductionMultiplier = 0.9;
        const shortWidth = sizeReductionMultiplier * slideWidth;
        const combinedWidth = slideWidth + 2 * shortWidth;
        const topTracksBoxSideMargin = fontSize;
        const topTracksBoxes = songValencesData 
            ? _.map(timeRanges, (timeRange, i) => {
                const slideSizeMultiplier = i === timeRangeIndex ? 1 : sizeReductionMultiplier;
                return (
                    <TopTracksBox
                        key={timeRange}
                        id={`${userScreenId}-${timeRange}`} 
                        fontSize={fontSize * slideSizeMultiplier}
                        height={height * slideSizeMultiplier}
                        sideMargin={topTracksBoxSideMargin * slideSizeMultiplier}
                        subSideMargin={fontSize * slideSizeMultiplier}
                        songValencesData={songValencesData[i]}
                        style={{
                            transform: `translate(${topTracksBoxesShift[timeRange]['short'] * shortWidth + topTracksBoxesShift[timeRange]['regular'] * slideWidth}px, 0)`,
                            zIndex: zIndexMap[timeRange]
                        }}
                        timeRange={timeRange}
                        title={timeRangeToTitle[timeRange]}
                        topArtists={topArtists[i]} 
                        topSongs={topSongs[i]}
                        width={slideWidth * slideSizeMultiplier} />
                );
            })
            : null;

        const leftShift = (combinedWidth - slideWidth) / 2;

        return (
            <div className="UserScreen">
                {/* Subtracting by 24 since that's the elements size */}
                <HelpOutlineIcon className="HelpIcon" style={{transform: `translateX(${slideWidth / 2 - topTracksBoxSideMargin - 24 - 10}px)`, paddingTop: `10px`}} onClick={this.openHelpModal}/>
                <Modal 
                    open={helpModalOpen}
                    onClose={this.closeHelpModal}
                >
                    <div className="Modal HelpModal" style={{width: `${slideWidth - 20}px`, padding: `0 10px`}}>
                        <p style={{textAlign: 'center'}}>Welcome to Quarantine Rewind!</p>
                        <div>
                            This app shows you your top songs and artists over different time periods:
                            <ul>
                                <li>Monthly: Past month</li>
                                <li>Quarantine: Past 6 months</li>
                                <li>Lifetime: Past couple years</li>
                            </ul>
                        </div>
                        <p>Use the play buttons at the bottom to cycle through the cards and the share button to export the card as an image.</p>
                    </div>
                </Modal>
                <Modal 
                    open={shareModalOpen}
                    onClose={this.closeShareModal}
                >
                    <div className="Modal ShareModal" style={{width: `${slideWidth - 20}px`, padding: `0 10px`}}>
                        <div><span className="DirectionsText">Tap + Hold</span> to save image on mobile devices</div>
                        <div><span className="DirectionsText">Right click</span> to save image on desktop</div>
                    </div>
                </Modal>
                <div style={{position: 'relative'}}>
                    <div className="TopTrackBoxesContainer" style={{transform: `translate(${leftShift}px, 0)`, height: `${height}px`}}>
                        { topTracksBoxes }
                    </div>

                    {!songValencesData ? null :
                        <div className="UserScreenButtons" style={{bottom: `${fontSize}px`, width: `${slideWidth - 2 * topTracksBoxSideMargin}px`}}>
                            <div className="RewindTimeRangeIcon"
                                onClick={this.rewind}>
                                <small className="IconLabel" style={{marginBottom: `${fontSize / 2}px`}}>
                                    {timeRangeIndex === 0
                                        ? timeRangeToTitle[timeRanges[timeRanges.length - 1]]
                                        : timeRangeToTitle[timeRanges[timeRangeIndex - 1]]
                                    }
                                </small>
                                <div style={{fontSize:`${fontSize * 2}px`}}>
                                    <FastRewindIcon className="IconButton CustomFont" style={{padding:`${fontSize / 2}px`}}/>
                                </div>
                            </div>
                            <div className="ShareIcon" onClick={this.share}>
                                <small className="IconLabel" style={{marginBottom: `${fontSize / 2}px`}}>Share</small>
                                <div style={{fontSize:`${fontSize * 2}px`}}>
                                    <ShareIcon className="IconButton CustomFont" style={{padding:`${fontSize / 2}px`}}/>
                                </div>
                            </div>
                            <div className="ForwardTimeRangeIcon"
                                onClick={this.forward}>
                                <small className="IconLabel" style={{marginBottom: `${fontSize / 2}px`}}>
                                    {timeRangeIndex === timeRanges.length - 1
                                        ? timeRangeToTitle[timeRanges[0]]
                                        : timeRangeToTitle[timeRanges[timeRangeIndex + 1]]
                                    }
                                </small>
                                <div style={{fontSize:`${fontSize * 2}px`}}>
                                    <FastForwardIcon className="IconButton CustomFont" style={{padding:`${fontSize / 2}px`}}/>
                                </div>
                            </div>
                        </div>
                    }
                </div>

                <Button className="LogoutButton SpotifyButton" variant="contained" onClick={this.props.logout}>
                    Log Out
                </Button>
            </div>
        );
    }
}

export default UserScreen;