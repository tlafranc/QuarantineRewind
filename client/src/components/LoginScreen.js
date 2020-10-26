// Import libraries
import React from 'react';

// Import React Components
import ShearedTitle from './ShearedTitle.js'

// Material UI
import Button from '@material-ui/core/Button';

// Import CSS and photos
import './LoginScreen.scss';
// import SpotifyLogo from '../images/SpotifyLogo2.png';

const loginUri = process.env.NODE_ENV === "production" 
    ? 'https://qrewind.herokuapp.com/login'
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
                <div className="LoginContent">
                    <ShearedTitle className="ShadowContainer Title" fontSize={fontSize * 1.4} shadow={true} title={`Quarantine Rewind`} />
                    <h3 className="SubTitle" style={{marginTop: `${fontSize}px`}}>Find out your top songs and artists</h3>
                    <div className="ButtonContainer">
                        <Button className="SpotifyButton LoginButton" variant="contained" onClick={this.login}>
                            Log In
                        </Button>
                        <div className="Smaller Youtube">Don't have Spotify? Watch the <a href="https://github.com/tlafranc/QuarantineRewind">YouTube</a> video</div>
                    </div>
                    <div className="ContentInfo">
                        <div className="Smaller">Created by Thomas Lafrance</div>
                        <div className="Smaller">Code is open source and can be found <a href="https://github.com/tlafranc/QuarantineRewind">here</a></div>
                    </div>
                </div>
            </div>
        );
    }
}

export default LoginScreen;