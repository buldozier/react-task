import React from 'react';
import "./MyButtonBlue.scss"
const MyButtonBlue = ({children, classes, isDisabled, ...props}) => {
    let addClasses = classes && classes.length > 0 ? classes.join(" ") : ""

    if (isDisabled) {
        addClasses += " disabled "
    }

    return (
        <button {...props} className={"button-blue " + addClasses}>
            {children}
        </button>
    );
};

export default MyButtonBlue;