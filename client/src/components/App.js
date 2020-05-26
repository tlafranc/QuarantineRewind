// Import libraries
import React from 'react';
import _ from 'lodash';

// Import React Components
import LoginScreen from './LoginScreen.js';
import UserScreen from './UserScreen.js';

// Import CSS
import './App.css';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			dim: Math.min(Math.min(window.innerWidth, window.innerHeight) * 0.8, 1000),
			loggedIn: false
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
            dim: Math.min(window.innerWidth * 0.8, 1000)
        });
	}, 100)

	render() {
		const { dim, loggedIn } = this.state;

		return (
			<div>
				<h1 className="header">Quarantine Rewind</h1>
				{loggedIn 
					? <UserScreen dim={dim}/>
					: <LoginScreen />
				}
			</div>
		);
	}
}

export default App;
