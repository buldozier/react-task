import React from 'react';
import "./MyLoaderSpinner.scss"

const MyLoaderSpinner = ({classes}) => {
    const addClasses = classes && classes.length > 0 ? classes.join(" ") : ""


    return (
        <svg className={"spinner " + addClasses} viewBox="0 0 50 50">
            <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
        </svg>
    );
};

export default MyLoaderSpinner;