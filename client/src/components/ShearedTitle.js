// Import libraries
import React from 'react';

// Import CSS
import './ShearedTitle.scss';

const ShearedTitle = props => {
    const { className, fontSize, title, shadow } = props;
    return (
        <div className={`${className} ShearedTitle`} style={{fontSize: `${fontSize}px`, marginTop: `${fontSize}px`}}>
            { !shadow ? null :
                <div className="Shadow">
                    <h2 className="Header1" style={{clipPath: `inset(0px 0px ${fontSize * 13 / 16}px 0px)`}}>
                        {title}
                    </h2>
                    <h2 className="Header2" style={{clipPath: `inset(${fontSize * 15 / 16}px 0px ${fontSize / 2}px 0px)`}}>
                        {title}
                    </h2>
                    <h2 className="Header3" style={{clipPath: `inset(${fontSize * 5 / 4}px 0px 0px 0px)`}}>
                        {title}
                    </h2>
                </div>
            }
            <h2 className="HeaderBlank">
                {title}
            </h2>
            <h2 className="Header1 ShadowMain" style={{color: 'white', clipPath: `inset(0px 0px ${fontSize * 3 / 4}px 0px)`}}>
                {title}
            </h2>
            <h2 className="Header2 ShadowMain" style={{color: 'white', clipPath: `inset(${fontSize * 15 / 16}px 0px ${fontSize / 2}px 0px)`}}>
                {title}
            </h2>
            <h2 className="Header3 ShadowMain" style={{color: 'white', clipPath: `inset(${fontSize * 5 / 4}px 0px 0px 0px)`}}>
                {title}
            </h2>
        </div>
    );
}
    
export default ShearedTitle;