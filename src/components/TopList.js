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
            return <text key={key} x="0" y={`${i * 20}px`}>{key}</text>
        }).value();

        return (
            <g style={this.props.style}>
                <text>Top 5 Artists</text>
                <g style={{transform: `translate(0px, 20px)`}}>
                    {listItems}
                </g>
            </g>
        );
    }
}

export default TopList;