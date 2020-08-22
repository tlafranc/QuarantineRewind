// Import libraries
import React from 'react';
import _ from 'lodash';
import axios from 'axios';

// Import React Components
import LoginScreen from './LoginScreen.js';
import UserScreen from './UserScreen.js';

// Import CSS
import './App.scss';

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

const expireTime = 5; // 30 minutes
const refreshUri = process.env.NODE_ENV == "production" 
    ? 'https://quarantine-rewind.herokuapp.com/refresh_token'
	: 'http://localhost:8888/refresh_token';
	
const slideWidth = 375;

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			accessToken: null,
			height: Math.min(window.innerHeight, 750),
			slideWidth: Math.min(window.innerWidth, slideWidth),
			combinedWidth: Math.min(window.innerWidth, slideWidth * 3)
		};
	}

	async componentDidMount() {
		window.addEventListener('resize', this.updateDimensions);

		const hashParams = getHashParams();
		let accessToken = null;

		const savedAccessToken = window.localStorage.getItem('accessToken');
		const savedRefreshToken = window.localStorage.getItem('refreshToken');
		const accessTokenTime = window.localStorage.getItem('accessTokenTime');

		if (!savedAccessToken && 'access_token' in hashParams) {
			accessToken = hashParams.access_token;

			window.localStorage.setItem('accessToken', accessToken);
			window.localStorage.setItem('refreshToken', hashParams.refresh_token);
			window.localStorage.setItem('accessTokenTime', Date.now());

		} else if (savedAccessToken && Date.now() - accessTokenTime > expireTime) {
			accessToken = (await axios.get(`${refreshUri}?refresh_token=${savedRefreshToken}`)).data.access_token;
			
			window.localStorage.setItem('accessToken', accessToken);
			window.localStorage.setItem('accessTokenTime', Date.now());
		} else {
			accessToken = savedAccessToken;
		}

		this.setState({
			accessToken
		});
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
    }

    updateDimensions = _.throttle(() => {
        this.setState({
			height: Math.min(window.innerHeight, 750),
			slideWidth: Math.min(window.innerWidth, slideWidth),
			combinedWidth: Math.min(window.innerWidth, slideWidth * 3)
        });
	}, 100)

	render() {
		const { height, slideWidth, combinedWidth, accessToken } = this.state;

		return (
			<div className="App" style={{ height: window.innerHeight }}>
				<div className="Content" style={{ 
					height: `${height}px`, 
					width: `${combinedWidth}px`, 
					margin: '0 auto'
				}}>
					{accessToken 
						? <UserScreen height={height} slideWidth={slideWidth} combinedWidth={combinedWidth} accessToken={accessToken} />
						: <LoginScreen height={height} width={slideWidth}/>
					}
				</div>
			</div>
		);
	}
}

export default App;
