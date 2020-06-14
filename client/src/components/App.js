// Import libraries
import React from 'react';
import _ from 'lodash';

// Import React Components
import LoginScreen from './LoginScreen.js';
import UserScreen from './UserScreen.js';

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
			width: Math.min(window.innerWidth, 600),
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
            width: Math.min(window.innerWidth, 600)
        });
	}, 100)

	render() {
		const { width, accessToken } = this.state;

		return (
			<div className="App">
				<div className="Content" style={{ width: `${width}px`, margin: '0 auto' }}>
					{accessToken 
						? <UserScreen width={width} accessToken={accessToken} />
						: <LoginScreen />
					}
				</div>
			</div>
		);
	}
}

export default App;
