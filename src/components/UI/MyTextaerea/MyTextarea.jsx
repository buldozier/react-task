import React, {useEffect, useRef, useState} from 'react';
import "./MyTextarea.scss"

const MyTextarea = ({defaultValue, setFocus, defaultHeight, classes, onChange, onFocus, onBlur, disableEnter, textareaEnterHandler, ...props}) => {
    const [value, setValue] = useState('')
    const textareaRef = useRef()
    const [isFocus, setIsFocus] = useState(false);
    const addClasses = classes && classes.length > 0 ? classes.join(" ") : ""


    useEffect(() => {
        setValue(defaultValue)

        if(setFocus) {
            textareaRef.current.focus()
        }

        if (defaultHeight) {
            textareaRef.current.style.minHeight = defaultHeight + 20 + "px"
        }
    }, []);

    useEffect(() => {
        changeTextareaHeight()
    }, [value]);

    const changeTextareaHeight = () => {
        textareaRef.current.style.height = 0
        textareaRef.current.style.height = (textareaRef.current.scrollHeight + 6) + "px"
    }

    const onBlurHandler = (e) => {
        setValue(e.target.value.trim())
        setIsFocus(false)
        if(onBlur) {
            onBlur(e)
        }
    }

    const changeValue = (e) => {
        const value = e.target.value
        setValue(value)
        onChange(value)
    }

    const onFocusHandler = (e) => {
        e.target.selectionStart = e.target.value.length
        setIsFocus(true)
        if(onFocus) {
            onFocus(e)
        }
    }

    const keyDownHandler = (e) => {
        if(disableEnter && e.keyCode === 13 && (e.ctrlKey === true || e.metaKey === true)) {
            e.preventDefault()
            if (textareaEnterHandler) {
                textareaEnterHandler(isFocus)
            }
        }
    }

    return (
        <textarea
            className={"my-textarea " + addClasses}
            value={value ? value : ''}
            onChange={changeValue}
            onKeyDown={keyDownHandler}
            onBlur={onBlurHandler}
            ref={textareaRef}
            {...props}
            onFocus={onFocusHandler}
        >

        </textarea>
    );
};

export default MyTextarea;