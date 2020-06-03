// Import libraries
import React from 'react';

const login_uri = process.env.NODE_ENV == "PRODUCTION" 
    ? 'https://quarantine-rewind.herokuapp.com/login'
    : 'http://localhost:8888/login';

class LoginScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            
        };
    }

    login = () => {
        window.location.href = login_uri;
    }

    render() {
        return (
            <div>
                Log In Screen
                <button onClick={this.login}>
                    Login
                </button>
            </div>
        );
    }
}

export default LoginScreen;