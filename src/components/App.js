// Import libraries
import React from 'react';
import _ from 'lodash';
import html2canvas from 'html2canvas';

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
	
	share = () => {
		html2canvas(document.getElementById("ShareBox")).then(canvas => {
			console.log(canvas);
			const img = canvas.toDataURL()
			let imageElement = document.createElement("img");  
			imageElement.src = img;
			imageElement.width = canvas.width / 2;
			imageElement.height = canvas.height / 2;
			document.body.appendChild(imageElement)
		});
	}

	render() {
		return (
			<div>
				<h1 className="header">Quarantine Rewind</h1>
				<TimeRangeSelect />
				<TopTracksBox id="ShareBox" dim={this.state.dim} />
				<button onClick={this.share}>
					Share
				</button>
			</div>
		);
	}
}

export default App;
