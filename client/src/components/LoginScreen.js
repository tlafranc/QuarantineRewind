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
        const { height, width } = this.props;

        return (
            <div className="LoginScreen" style={{ height: `${height}px`, width: `${width}px`, margin: `0 auto`}}>
                <div className="Header Header1">
                    <h2 className="RewindText">REW</h2>
                    <ArrowBackIosOutlinedIcon className="RewindIcon" style={{ marginRight: '-10px' }}/>
                    <ArrowBackIosOutlinedIcon className="RewindIcon" />
                </div>
                <div className="Header Header2">
                    <h2 className="RewindText">REW</h2>
                    <ArrowBackIosOutlinedIcon className="RewindIcon" style={{ marginRight: '-10px' }}/>
                    <ArrowBackIosOutlinedIcon className="RewindIcon" />
                </div>
                <div className="Header Header3">
                    <h2 className="RewindText">REW</h2>
                    <ArrowBackIosOutlinedIcon className="RewindIcon" style={{ marginRight: '-10px' }}/>
                    <ArrowBackIosOutlinedIcon className="RewindIcon" />
                </div>
                <div className="LoginContent">
                    <h1>Quarantine Rewind</h1>
                    <h3>Find out your top songs and artists</h3>
                    <div className="ContentInfo">
                        <small>Code is open source and can be found on GitHub</small>
                        <small>Don't have a Spotify account? Watch the YouTube video</small>
                        <small>Made by Thomas Lafrance</small>
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