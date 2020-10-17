// Import libraries
import React from 'react';

class ThreeImageLayout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            
        };
    }

    render() {
        const { images, width } = this.props;
        const verticalShift = 8;

        return (
            <div className="ThreeImageLayout" style={{height: `${width}px`}}>
                <img className="image" src={images[2].url} alt={`${images[2].alt}`} width={`${width}px`} height={`${width}px`} 
                    style={{
                        transform: `translate(${width * 2}px, ${verticalShift}px)`
                    }}
                />
                <img className="image" src={images[1].url} alt={`${images[1].alt}`} width={`${width}px`} height={`${width}px`} 
                    style={{
                        transform: `translate(${width * 1 / 5}px, 0)`
                    }}
                />
                <img className="image" src={images[0].url} alt={`${images[0].alt}`} width={`${width}px`} height={`${width}px`} 
                    style={{
                        transform: `translate(${-width * 8 / 5}px, ${-1 * verticalShift}px)`
                    }}
                />
            </div>
        );
    }
}

export default ThreeImageLayout;