// Import libraries
import React from 'react';
import _ from 'lodash';

class TopList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            
        };
    }

    render() {
        const { list } = this.props;
        const listItems = _(list).map((key, i) => {
            return <div key={key}>{key}</div>
        }).value();

        return (
            <div>
                <ul>{listItems}</ul>
            </div>
        );
    }
}

export default TopList;