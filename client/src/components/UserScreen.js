// Import libraries
import React from 'react';
import html2canvas from 'html2canvas';

// Import React Components
import TimeRangeSelect from './TimeRangeSelect.js';
import TopTracksBox from './TopTracksBox.js'

const userScreenId = "ShareBox";

class UserScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            
        };
    }

    share = () => {
		html2canvas(document.getElementById(userScreenId)).then(canvas => {
			console.log(canvas);
			const img = canvas.toDataURL()
			let imageElement = document.createElement("img");  
			imageElement.src = img;
			imageElement.alt = "Your Quarantine Rewind";
			imageElement.width = canvas.width / 2;
			imageElement.height = canvas.height / 2;
			document.body.appendChild(imageElement)
		});
	}

    render() {
        const { dim } = this.props;

        return (
            <div>
                <TimeRangeSelect />
                <TopTracksBox id={userScreenId} dim={dim} />
                <button onClick={this.share}>
                    Share
                </button>
            </div>
        );
    }
}

export default UserScreen;