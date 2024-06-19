import React from 'react';
import "./MyButton.scss"

const MyButton = ({children, classes=[], ...props}) => {

    const addClasses = classes  && classes.length > 0 ? classes.join(" ") : ""

    return (
        <button
            {...props}
            className={"my-button " + addClasses}>
            {children}
        </button>
    );
};

export default MyButton;