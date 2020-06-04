// Import libraries
import React from 'react';

// Material UI
import Button from '@material-ui/core/Button';

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
            <div className="ButtonContainer">
                <Button className="LoginButton" variant="contained" onClick={this.login}>
                    Log In
                </Button>
            </div>
        );
    }
}

export default LoginScreen;