// Import libraries
import React from 'react';
import _ from 'lodash';

class ThreeImageLayout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            
        };
    }

    render() {
        const { images, width } = this.props;

        return (
            <div className="ThreeImageLayout">
                <img className="image" src={images[2].url} alt={`${images[2].alt}`} width={`${width}px`}
                    style={{
                        transform: `translate(${width * 9 / 5}px, ${width / 5}px)`
                    }}
                />
                <img className="image" src={images[1].url} alt={`${images[1].alt}`} width={`${width}px`}
                    style={{
                        transform: `translate(0, 0)`
                    }}
                />
                <img className="image" src={images[0].url} alt={`${images[0].alt}`} width={`${width}px`}
                    style={{
                        transform: `translate(${-width * 9 / 5}px, ${-width / 5}px)`
                    }}
                />
            </div>
        );
    }
}

export default ThreeImageLayout;