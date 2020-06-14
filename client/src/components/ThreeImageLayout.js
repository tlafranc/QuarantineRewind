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
        const imageWidth = width / 3;

        return (
            <div className="ThreeImageLayout">
                <img className="image" src={images[2].url} alt={`${images[2].alt}`} width={`${imageWidth}px`}
                    style={{
                        transform: `translate(${imageWidth * 2}px, ${imageWidth / 5}px)`
                    }}
                />
                <img className="image" src={images[1].url} alt={`${images[1].alt}`} width={`${imageWidth}px`}
                    style={{
                        transform: `translate(${imageWidth / 5}px, 0)`
                    }}
                />
                <img className="image" src={images[0].url} alt={`${images[0].alt}`} width={`${imageWidth}px`}
                    style={{
                        transform: `translate(${-imageWidth * 8 / 5}px, ${-imageWidth / 5}px)`
                    }}
                />
            </div>
        );
    }
}

export default ThreeImageLayout;