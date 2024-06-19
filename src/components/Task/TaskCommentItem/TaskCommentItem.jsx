import React, {useEffect, useState} from 'react';
import "./TaskCommentItem.scss"
import Person from "../../Person/Person";
import {useSelector} from "react-redux";
import MyCommentTextarea from "../../UI/MyCommentTextarea/MyCommentTextarea";
import MyButtonBlue from "../../UI/MyButtonBlue/MyButtonBlue";
import MyButton from "../../UI/MyButton/MyButton";
import {useFetching} from "../../../hooks/useFetching";
import PostService from "../../../API/PostService";
import MyLoaderSpinner from "../../UI/MyLoaderSpinner/MyLoaderSpinner";


const TaskCommentItem = ({comment}) => {
    const currentUser = useSelector(state => state.currentUser.currentUser)

    const [commentValue, setCommentValue] = React.useState('');
    const [defaultCommentValue, setDefaultCommentValue] = React.useState('');
    const [commentValueHtml, setCommentValueHtml] = React.useState('');
    const [edit, setEdit] = useState(false)
    const [isAddDisabled, setIsAddDisabled] = useState(false)

    const [fetchUpdateTaskComment] = useFetching(async (id, value) => {
        await PostService.updateTaskComment(id, value)
    })

    const [fetchParsedownText, isLoadingParsedownText] = useFetching(async (text) => {
        const response = await PostService.getParsedownText(text)
        if (response.data.success && response.data.result !== false) {
            setCommentValueHtml(response.data.result)
        }
    })

    useEffect(() => {
        const LSkey = 'task_comment_orig_' + comment.id;
        const value = localStorage.getItem(LSkey);

        if (value) {
            setCommentValue(value);
        } else {
            setCommentValue(comment.text);
        }

        setDefaultCommentValue(comment.text)
        setCommentValueHtml(comment.text_html)

    }, []);

    const editComment = () => {
        setEdit(true)
    }

    const onFocusComment = () => {
        if (commentValue) {
            setIsAddDisabled(false)
        }

    }

    const onChangeComment = (e) => {
        const value = e.target.value

        if (value === "") {
            setIsAddDisabled(true)
        } else {
            setIsAddDisabled(false)
        }
        setCommentValue(value)
        const LSkey = 'task_comment_orig_' + comment.id;
        localStorage.setItem(LSkey, value);
    }

    const saveCommentEdit = (isFocus) => {
        if (!isAddDisabled && isFocus) {
            fetchUpdateTaskComment(comment.id, commentValue)
            fetchParsedownText(commentValue)
            setEdit(false)
            const LSkey = 'task_comment_orig_' + comment.id;

            delete localStorage[LSkey];
        }
    }

    const onCancelComment = () => {
        setEdit(false)
        const LSkey = 'task_comment_orig_' + comment.id;
        setCommentValue(defaultCommentValue)

        delete localStorage[LSkey];
    }

    return (
        <div id={comment.id} className="comment">
            <Person
                person={comment.user}
                hideName
                size={'m'}
            />
            <div className="comment__holder">
                <div className='comment__header'>
                    <div className='comment__user-name'>
                        {comment.user.full_name}
                        {isLoadingParsedownText &&
                            <MyLoaderSpinner classes={['comment__user-name-loader']}/>
                        }
                    </div>
                    <div className="comment__comment-date">{comment.date_create_string}</div>
                </div>
                <div className="comment__content">
                    {!edit
                        ? <div
                            className="comment__content-value"
                            dangerouslySetInnerHTML={{__html: commentValueHtml}}
                        ></div>
                        : <MyCommentTextarea
                            classes={["comment__content-value-textarea"]}
                            onChange={onChangeComment}
                            value={commentValue ? commentValue : ''}
                            focusOnComment={true}
                            onFocus={onFocusComment}
                            disableEnter={true}
                            textareaEnterHandler={(isFocus) => saveCommentEdit(isFocus)}
                        />
                    }
                    <div className="comment__content-btns">
                        {!edit && Number(currentUser.id) === Number(comment.user.id) &&
                            <button
                                className='comment__edit-btn'
                                onClick={editComment}
                            >
                                Изменить
                            </button>
                        }
                        {edit && Number(currentUser.id) === Number(comment.user.id) &&
                            <div className="comment__edit-btns">
                                <MyButtonBlue
                                    onClick={() => saveCommentEdit(true)}
                                    isDisabled={isAddDisabled}
                                >
                                    Сохранить
                                </MyButtonBlue>
                                <MyButton
                                    classes={['comment__cancel-btn']}
                                    onClick={onCancelComment}
                                >
                                    Отменить
                                </MyButton>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskCommentItem;