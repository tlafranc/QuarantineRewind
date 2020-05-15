import React from 'react';
import TimeRangeSelect from './TimeRangeSelect.js';
import TopTracksInfo from './TopTracksInfo.js';
import './TopTracksBox.css';

class TopTracksBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            
        };
    }

    render() {
        return (
            <div>
                <TimeRangeSelect />
                <h1>Hello, {this.props.name}</h1>
                <TopTracksInfo className="TopTracksInfo" />
            </div>
        );
    }
}

export default TopTracksBox;
