// Import libraries
import React from 'react';
import _ from 'lodash';

import SpotifyIcon from '../images/Spotify_Icon_RGB_Black.png';

class ThreeImageLayout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            
        };
    }

    render() {
        const { images, width } = this.props;
        const verticalShift = 8;

        return (
            <div className="ThreeImageLayout" style={{height: `${width}px`}}>
                {!images[2] 
                    ?  
                        <img className="image" src={SpotifyIcon} alt={'Spotify Icon'} width={`${width}px`} height={`${width}px`} 
                            style={{
                                transform: `translate(${width * 2}px, ${verticalShift}px)`,
                                opacity: 0
                            }}
                        />
                    : 
                        <img className="image" src={_.get(images[2],'url') || SpotifyIcon} alt={`${images[2].alt}`} width={`${width}px`} height={`${width}px`} 
                            style={{
                                transform: `translate(${width * 2}px, ${verticalShift}px)`
                            }}
                        />
                }
                {!images[1] 
                    ? 
                        <img className="image" src={SpotifyIcon} alt={'Spotify Icon'} width={`${width}px`} height={`${width}px`} 
                            style={{
                                transform: `translate(${width * 1 / 5}px, 0)`,
                                opacity: 0
                            }}
                        />
                    :
                        <img className="image" src={_.get(images[1],'url') || SpotifyIcon} alt={`${images[1].alt}`} width={`${width}px`} height={`${width}px`} 
                            style={{
                                transform: `translate(${width * 1 / 5}px, 0)`
                            }}
                        />
                }
                {!images[0] 
                    ? 
                        <img className="image" src={SpotifyIcon} alt={'Spotify Icon'} width={`${width}px`} height={`${width}px`} 
                            style={{
                                transform: `translate(${-width * 8 / 5}px, ${-1 * verticalShift}px)`,
                                opacity: 0
                            }}
                        /> 
                    :
                        <img className="image" src={_.get(images[0],'url') || SpotifyIcon} alt={`${images[0].alt}`} width={`${width}px`} height={`${width}px`} 
                            style={{
                                transform: `translate(${-width * 8 / 5}px, ${-1 * verticalShift}px)`
                            }}
                        />
                }
            </div>
        );
    }
}

export default ThreeImageLayout;