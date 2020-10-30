// Import libraries
import React from 'react';
import axios from 'axios';
import domtoimage from 'dom-to-image';
import _ from 'lodash';

// Import React Components
import TopTracksBox from './TopTracksBox.js'

// Material UI
import SaveIcon from '@material-ui/icons/Save';
import FastRewindIcon from '@material-ui/icons/FastRewind';
import FastForwardIcon from '@material-ui/icons/FastForward';
import Modal from '@material-ui/core/Modal';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
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
            helpLogoutButton: false,
            shareModalOpen: false,
            shareImageRendered: false,
            timeRangeIndex: 1,
            touchStartPos: null,
            showExtraHelp: false,
            songValencesData: null,
            topArtists: null,
            topSongs: null
        };

        this.userScreenRef = React.createRef();
    }

    async componentDidMount() {
        this.userScreenRef.current.addEventListener('touchstart', this.touchStart);
        this.userScreenRef.current.addEventListener('touchend', this.touchEnd);

        const topArtists = await Promise.all(_.map(timeRanges, async (timeRange) => {
            return (await this.spotifyRequest(`https://api.spotify.com/v1/me/top/artists?limit=3&time_range=${timeRange}`)).data.items;
        }));
        const topSongs = await Promise.all(_.map(timeRanges, async (timeRange) => {
            return (await this.spotifyRequest(`https://api.spotify.com/v1/me/top/tracks?limit=25&time_range=${timeRange}`)).data.items;
        }));
        const songValencesData = await Promise.all(_.map(topSongs, async (topSongsList) => {
            return await this.getSongValencesData(topSongsList); 
        }));

        // Set 10 second timer for data to load
        setTimeout(() => {
            this.setState({
                showExtraHelp: true
            });
        }, 5000);

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

    share = _.debounce(async () => {
        const { timeRangeIndex, shareModalOpen } = this.state;
        if (shareModalOpen) return;

        this.setState({
            shareModalOpen: true
        }, async () => {
            const { fontSize } = this.props;
            const node = document.getElementById(`${userScreenId}-${timeRanges[timeRangeIndex]}`);
            const height = node.offsetHeight * 0.92;
            const scale = 2;
            await domtoimage.toPng(node, {
                height: height * scale,
                width: node.offsetWidth * scale,
                style: {
                    transform: `scale(${scale})`,
                    transformOrigin: "top left",
                    width: `${node.offsetWidth}px`,
                    height: `${height}px`
                }
            });

            const url = document.getElementById(`${timeRanges[timeRangeIndex]}-url`);
            url.style.opacity = 1;

            domtoimage.toPng(node, {
                height: height * scale,
                width: node.offsetWidth * scale,
                style: {
                    transform: `scale(${scale})`,
                    transformOrigin: "top left",
                    width: `${node.offsetWidth}px`,
                    height: `${height}px`
                }
            }).then((dataUrl) => {
                    url.style.opacity = 0;
                    let imageElement = document.createElement("img");  
                    imageElement.src = dataUrl;
                    imageElement.alt = "Your Quarantine Rewind";
                    imageElement.width = node.offsetWidth - 4 * fontSize;
                    let imageContainer = document.getElementsByClassName('ShareModalImage')[0];
                    imageContainer.innerHTML = "";
                    imageContainer.appendChild(imageElement);

                    this.setState({
                        shareImageRendered: true
                    });
                })
                .catch(function (error) {
                    console.error('Dom To Image Error: ', error);
                });
        });
    }, 200);

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
            helpModalOpen: true,
            helpLogoutButton: true
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
            shareModalOpen: false,
            shareImageRendered: false
        });
    };

    touchStart = (event) => {
        this.setState({
            touchStartPos: [event.pageX, event.pageY]
        })
    };

    touchEnd = (event) => {
        const { touchStartPos } = this.state;
        const currentPos = [event.pageX, event.pageY];
        const xDiff = currentPos[0] - touchStartPos[0];
        const yDiff = currentPos[1] - touchStartPos[1];

        if (xDiff > 100 && Math.abs(yDiff) < 100) {
            this.rewind();
        } else if (xDiff < -100 && Math.abs(yDiff) < 100) {
            this.forward();
        }
    };

    render() {
        const { height, combinedWidth, slideWidth, sizeReductionMultiplier, fontSize } = this.props;
        const { lastAction, helpModalOpen, helpLogoutButton, shareModalOpen, shareImageRendered, showExtraHelp, songValencesData, timeRangeIndex, topArtists, topSongs } = this.state;
        
        const activeTimeRange = timeRanges[timeRangeIndex];
        const topTracksBoxesShift = timeRangeToShift[activeTimeRange];

        const zIndexMapConstants = lastAction === 'forward' ? forwardTimeRangeToZIndex : rewindTimeRangeToZIndex;
        const zIndexMap = zIndexMapConstants[activeTimeRange];

        const shortWidth = sizeReductionMultiplier * slideWidth;
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
                            // TODO: Required for background images
                            backgroundSize: `auto ${height * slideSizeMultiplier}px`,
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
            <div className="UserScreen" ref={this.userScreenRef}>
                {/* Subtracting by 24 since that's the elements size */}
                <InfoOutlinedIcon 
                    className="HelpIcon" 
                    onClick={this.openHelpModal}
                    style={{
                        fontSize: `${fontSize * 3 / 2}px`,
                        transform: `translateX(${slideWidth / 2 - topTracksBoxSideMargin - (2 * fontSize)}px)`, 
                        paddingTop: `${fontSize * 5 / 4}px`}}
                />
                <Modal 
                    open={helpModalOpen}
                    onClose={this.closeHelpModal}
                >
                    <div className="Modal HelpModal" style={{width: `${slideWidth - 20}px`, fontSize: `${fontSize}px`}}>
                        <p style={{textAlign: 'center'}}>Welcome to Quarantine Rewind!</p>
                        <div>
                            This app shows you your top songs and artists over different time periods:
                            <ul>
                                <li>Monthly: Past Month</li>
                                <li>Quarantine: Past 6 Months</li>
                                <li>Lifetime: Past Couple Years</li>
                            </ul>
                        </div>
                        <p>Use the play buttons at the bottom to cycle through the cards and to download your results</p>

                        {!helpLogoutButton ? null : 
                            <div style={{textAlign: 'center', marginBottom: `${fontSize}px`}}>
                                <Button className="LogoutButton SpotifyButton" variant="contained" onClick={this.props.logout}>
                                    Log Out
                                </Button>
                            </div>
                        }
                    </div>
                </Modal>
                <Modal 
                    open={shareModalOpen}
                    onClose={this.closeShareModal}
                >
                    <div className="Modal ShareModal" style={{width: `${slideWidth - 4 * fontSize}px`, fontSize: `${fontSize}px`}}>
                        <div className="ShareModalText">
                            {!shareImageRendered ? <div>Making image...</div> : 
                                <div>
                                    <div>Mobile Device: <span className="DirectionsText">Tap + Hold</span> image to save</div>
                                    <div>Desktop: <span className="DirectionsText">Right Click</span> image to save</div>
                                </div>
                            }
                        </div>
                        <div className="ShareModalImage" style={{paddingTop: `${shareImageRendered ? fontSize : 0}px`}}></div>
                    </div>
                </Modal>
                <div style={{position: 'relative'}}>
                    <div className="TopTrackBoxesContainer" style={{transform: `translate(${leftShift}px, 0)`, height: `${height}px`}}>
                        { topTracksBoxes }
                    </div>

                    {!songValencesData 
                        ? 
                            <div className="Loading" style={{width: `${slideWidth}px`}}>
                                <h2>Loading data, please wait!</h2> 
                                {!showExtraHelp ? null : 
                                    <div className="Subtext">
                                        Please wait a few more seconds. If data doesn't load, try logging out using the i icon and then logging back in
                                    </div>
                                }
                            </div>
                            
                        :
                            <div className="UserScreenButtons" style={{width: `${slideWidth - 2 * topTracksBoxSideMargin}px`}}>
                                <div className="RewindTimeRangeIcon"
                                    onClick={this.rewind}>
                                    <div style={{fontSize:`${fontSize * 2}px`}}>
                                        <FastRewindIcon className="IconButton CustomFont" style={{padding:`${fontSize / 2}px`}}/>
                                    </div>
                                    <small className="IconLabel" style={{marginBottom: `${fontSize / 2}px`}}>
                                        {timeRangeIndex === 0
                                            ? timeRangeToTitle[timeRanges[timeRanges.length - 1]]
                                            : timeRangeToTitle[timeRanges[timeRangeIndex - 1]]
                                        }
                                    </small>
                                </div>
                                <div className="ShareIcon" onClick={this.share}>
                                    <div style={{fontSize:`${fontSize * 2}px`}}>
                                        <SaveIcon className="IconButton CustomFont" style={{padding:`${fontSize / 2}px`}}/>
                                    </div>
                                    <small className="IconLabel" style={{marginBottom: `${fontSize / 2}px`}}>Save</small>
                                </div>
                                <div className="ForwardTimeRangeIcon"
                                    onClick={this.forward}>
                                    <div style={{fontSize:`${fontSize * 2}px`}}>
                                        <FastForwardIcon className="IconButton CustomFont" style={{padding:`${fontSize / 2}px`}}/>
                                    </div>
                                    <small className="IconLabel" style={{marginBottom: `${fontSize / 2}px`}}>
                                        {timeRangeIndex === timeRanges.length - 1
                                            ? timeRangeToTitle[timeRanges[0]]
                                            : timeRangeToTitle[timeRanges[timeRangeIndex + 1]]
                                        }
                                    </small>
                                </div>
                            </div>
                    }
                </div>
            </div>
        );
    }
}

export default UserScreen;