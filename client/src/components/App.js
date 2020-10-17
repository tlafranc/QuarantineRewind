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

const expireTime = 30; // 30 minutes
const refreshUri = process.env.NODE_ENV === "production" 
    ? 'https://quarantine-rewind.herokuapp.com/refresh_token'
	: 'http://localhost:8888/refresh_token';
	
const maxHeight = 700;

class App extends React.Component {
	constructor(props) {
		super(props);

		const slideHeight = Math.min(window.innerHeight - 40, maxHeight);
		const slideWidth = slideHeight * 9 / 16;

		this.state = {
			accessToken: null,
			slideHeight,
			slideWidth,
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
		const slideHeight = Math.min(window.innerHeight - 40, maxHeight);
		const slideWidth = slideHeight * 9 / 16;

        this.setState({
			slideHeight,
			slideWidth,
			combinedWidth: Math.min(window.innerWidth, slideWidth * 3)
        });
	}, 100);

	logout = async () => {
		window.localStorage.removeItem('accessToken');
		window.localStorage.removeItem('refreshToken');
		window.localStorage.removeItem('accessTokenTime');

		window.location.href = window.location.href.split('#')[0]

		this.setState({
			accessToken: null
		});
	}

	render() {
		const { slideHeight, slideWidth, combinedWidth, accessToken } = this.state;
		const fontSize = 0.0229 * slideHeight;

		return (
			<div className="App" style={{ minHeight: window.innerHeight, fontSize: `${fontSize}px` }}>
				<div className="Content" style={{ 
					width: `${combinedWidth}px`, 
					margin: 'auto'
				}}>
					{accessToken 
						? <UserScreen height={slideHeight} slideWidth={slideWidth} combinedWidth={combinedWidth} accessToken={accessToken} logout={this.logout} fontSize={fontSize}/>
						: <LoginScreen height={slideHeight} width={slideWidth}/>
					}
				</div>
			</div>
		);
	}
}

export default App;
