// Import libraries
import React from 'react';

// Import React Components
import TopList from './TopList.js';

class TopTracksInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            
        };
    }

    render() {
        return (
            <div className={this.props.className}>
                <div>Top Artists</div>
                <TopList 
                    list={['Travis Scott', 'Kanye West', 'Kendrick Lamar', 'The Weekdnd', 'Frank Ocean']}
                />
                <div>Top Songs</div>
                <TopList
                    list={['Astroworld', 'My Beautiful Dark Twisted Fantasy', 'good kid, m.A.A.d city (Deluxe)', 'After Hours (Deluxe)', 'Chanel Orange']}
                />
            </div>
        );
    }
}

export default TopTracksInfo;