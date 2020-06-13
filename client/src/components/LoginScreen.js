// Import libraries
import React from 'react';

// Material UI
import Button from '@material-ui/core/Button';
import ArrowBackIosOutlinedIcon from '@material-ui/icons/ArrowBackIosOutlined';

// CSS
import './LoginScreen.scss';

const loginUri = process.env.NODE_ENV == "production" 
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
        return (
            <div className="LoginScreen">
                <div className="Header">
                    <h2>REW</h2>
                    <ArrowBackIosOutlinedIcon className="RewindIcon" />
                    <ArrowBackIosOutlinedIcon className="RewindIcon" />
                </div>
                <div className="Content">
                    <h1>Quarantine Rewind</h1>
                    <h3>Find out your top songs and artists.</h3>
                    <div className="ContentInfo">
                        <small>Monthly Rewind: Approximately last 4 weeks</small>
                        <small>Quarantine Rewind: Approximately last 6 months</small>
                        <small>Lifetime Rewind: Several years of data</small>
                    </div>
                </div>
                <div className="ButtonContainer">
                    <Button className="LoginButton" variant="contained" onClick={this.login}>
                        Log In
                    </Button>
                </div>
            </div>
        );
    }
}

export default LoginScreen;