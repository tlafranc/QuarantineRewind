// Import libraries
import React from 'react';

// Material UI
import Button from '@material-ui/core/Button';
import ArrowBackIosOutlinedIcon from '@material-ui/icons/ArrowBackIosOutlined';

// Import CSS and photos
import './LoginScreen.scss';
// import SpotifyLogo from '../images/SpotifyLogo2.png';

const loginUri = process.env.NODE_ENV === "production" 
    ? 'https://quarantine-rewind.herokuapp.com/login'
    : 'http://localhost:8888/login';

class LoginScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            
        };
    }

    login = () => {
        window.location.href = loginUri;
    }

    render() {
        const { fontSize, height, width } = this.props;

        return (
            // Reduce the width of the login screen by 2 * fontSize for consistency
            <div className="LoginScreen" style={{ height: `${height}px`, width: `${width - 2 * fontSize}px`, margin: `0 auto`}}>
                <div className="Header Header1" style={{ clipPath: `inset(0px 0px ${2 * fontSize * 33 / 32}px 0px)` }}>
                    <h2 className="RewindText">REW</h2>
                    <ArrowBackIosOutlinedIcon className="RewindIcon" style={{ marginRight: `${-1 * fontSize / 2}px` }}/>
                    <ArrowBackIosOutlinedIcon className="RewindIcon" />
                </div>
                <div className="Header Header2" style={{ clipPath: `inset(${2 * fontSize * 35 / 32}px 0px ${fontSize * 7 / 4}px 0px)` }}>
                    <h2 className="RewindText">REW</h2>
                    <ArrowBackIosOutlinedIcon className="RewindIcon" style={{ marginRight: `${-1 * fontSize / 2}px` }}/>
                    <ArrowBackIosOutlinedIcon className="RewindIcon" />
                </div>
                <div className="Header Header3" style={{ clipPath: `inset(${2 * fontSize * 39 / 32}px 0px 0px 0px)` }}>
                    <h2 className="RewindText">REW</h2>
                    <ArrowBackIosOutlinedIcon className="RewindIcon" style={{ marginRight: `${-1 * fontSize / 2}px` }}/>
                    <ArrowBackIosOutlinedIcon className="RewindIcon" />
                </div>
                <div className="LoginContent">
                    <h1>Quarantine Rewind</h1>
                    <h3>Find out your top songs and artists</h3>
                    <div className="ContentInfo">
                        <div className="Smaller">Code is open source and can be found on GitHub</div>
                        <div className="Smaller">Don't have Spotify? Watch the YouTube video</div>
                        <div className="Smaller">Made by Thomas Lafrance</div>
                    </div>
                </div>
                <div className="ButtonContainer">
                    <Button className="SpotifyButton LoginButton" variant="contained" onClick={this.login}>
                        Log In
                    </Button>
                </div>
            </div>
        );
    }
}

export default LoginScreen;