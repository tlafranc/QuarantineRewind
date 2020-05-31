// Import libraries
import React from 'react';
import _ from 'lodash';

// Import React Components
import LoginScreen from './LoginScreen.js';
import UserScreen from './UserScreen.js';

// Import CSS
import './App.scss';

// Material UI
import FastRewindOutlinedIcon from '@material-ui/icons/FastRewindOutlined';

// Function that parses the hash params of a URL
// Taken from https://github.com/spotify/web-api-auth-examples/blob/master/implicit_grant/public/index.html
// On 2020-05-26
function getHashParams() {
	var hashParams = {};
	var e, r = /([^&;=]+)=?([^&;]*)/g,
		q = window.location.hash.substring(1);
	while ( e = r.exec(q)) {
	   hashParams[e[1]] = decodeURIComponent(e[2]);
	}
	return hashParams;
}

class App extends React.Component {
	constructor(props) {
		super(props);

		const hashParams = getHashParams();
		let accessToken = null;
		if ('access_token' in hashParams) {
			accessToken = hashParams.access_token;
			// const refreshToken = hashParams.refresh_token;
		}

		this.state = {
			dim: Math.min(window.innerWidth, 600),
			accessToken
		};
	}

	componentDidMount() {
		window.addEventListener('resize', this.updateDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
    }

    updateDimensions = _.throttle(() => {
        this.setState({
            dim: Math.min(window.innerWidth, 600)
        });
	}, 100)

	render() {
		const { dim, accessToken } = this.state;

		return (
			<div className="App" style={{ width: `${dim}px` }}>
				<div className="HeaderBar">
					<FastRewindOutlinedIcon />
					<h1 className="Title">Quarantine Rewind</h1>
					<FastRewindOutlinedIcon />
				</div>
				{accessToken 
					? <UserScreen dim={dim} accessToken={accessToken} />
					: <LoginScreen />
				}
			</div>
		);
	}
}

export default App;
