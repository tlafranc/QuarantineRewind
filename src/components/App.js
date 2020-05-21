// Import libraries
import React from 'react';
import _ from 'lodash';

// Import React Components
import TimeRangeSelect from './TimeRangeSelect.js';
import TopTracksBox from './TopTracksBox.js'

// Import CSS
import './App.css';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			dim: Math.min(Math.min(window.innerWidth, window.innerHeight) * 0.8, 1000)
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
		return (
			<div>
				<h1 className="header">Quarantine Rewind</h1>
				<TimeRangeSelect />
				<TopTracksBox dim={this.state.dim} />
			</div>
		);
	}
}

export default App;
