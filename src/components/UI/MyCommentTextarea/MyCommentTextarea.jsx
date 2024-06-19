import React, {useEffect, useRef, useState} from 'react';
import "./MyCommentTextarea.scss"

const MyCommentTextarea = ({
        value,
        classes,
        onChange,
        defaultHeight,
        onBlur,
        onFocus,
        focusOnComment,
        disableEnter,
        textareaEnterHandler,
        ...props
}) => {
    const textareaRef = useRef()
    const addClasses = classes && classes.length > 0 ? classes.join(" ") : ""
    const [isFocus, setIsFocus] = useState(false);

    useEffect(() => {

        if (onFocus) {
            onFocus()
        }

        if (focusOnComment) {
            textareaRef.current.focus();
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

    const changeTextareaHeightOnBlur = (e) => {
        if (onBlur) {
            onBlur(e)
        }
        setIsFocus(false)
    }

    const onFocusHandler = (e) => {
        e.target.selectionStart = e.target.value.length
        setIsFocus(true)
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
            className={"my-comment-textarea " + addClasses}
            value={value}
            onChange={onChange}
            onBlur={changeTextareaHeightOnBlur}
            onKeyDown={keyDownHandler}
            ref={textareaRef}
            {...props}
            onFocus={onFocusHandler}
        >

        </textarea>
    );
};

export default MyCommentTextarea;