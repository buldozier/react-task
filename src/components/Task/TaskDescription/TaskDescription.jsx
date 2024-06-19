import React, {useEffect, useRef, useState} from 'react';
import "./TaskDescription.scss"
import MyTextarea from "../../UI/MyTextaerea/MyTextarea";
import MyButtonBlue from "../../UI/MyButtonBlue/MyButtonBlue";
import MyButton from "../../UI/MyButton/MyButton";
import {useFetching} from "../../../hooks/useFetching";
import PostService from "../../../API/PostService";

const TaskDescription = ({task, isLoadingGetParsedownDesc, setValue}) => {
    const descriptionInputRef = useRef()
    const [descriptionValue, setDescriptionValue] = useState('');
    const [descriptionValueHtml, setDescriptionValueHtml] = useState('');
    const [openDescriptionEdit, setOpenDescriptionEdit] = useState(false)

    const [fetchChangeTaskDescription] = useFetching(async (taskId, value) => {
        const response = await PostService.changeTaskDescription(taskId, value)
        if (response.data.success && response.data.result !== false) {
            setOpenDescriptionEdit(false);
            const LSkey = 'task_description_' + task.id;
            delete localStorage[LSkey];
            const LSkey2 = 'task_description_orig_' + task.id;
            delete localStorage[LSkey2];
        }
    })

    const [fetchParsedownText, isLoadingParsedownText] = useFetching(async (text) => {
        const response = await PostService.getParsedownText(text)
        if (response.data.success && response.data.result !== false) {
            setDescriptionValueHtml(response.data.result)
        }
    })

    useEffect(() => {
        if(task) {
            setDescriptionValue(task.description ? task.description : '')
            setDescriptionValueHtml(task.description_html ? task.description_html : (task.description ? task.description : ''))
        }
    }, []);

    useEffect(() => {
        if(isLoadingGetParsedownDesc) {
            isLoadingGetParsedownDesc(isLoadingParsedownText)
        }
    }, [isLoadingParsedownText]);

    const onFocusDescription = (e) => {
        e.stopPropagation()
        if (!e.target.closest('a')) {
            setOpenDescriptionEdit(true);

            if(task) {
                const LSkey = 'task_description_' + task.id;
                const LSitem = localStorage.getItem(LSkey);
                const LSkey2 = 'task_description_orig_' + task.id;
                const LSitem2 = localStorage.getItem(LSkey2);
                if(LSitem && LSitem2){
                    if(LSitem.length > LSitem2.length){
                        setDescriptionValue(LSitem);
                    } else {
                        setDescriptionValue(LSitem2);
                    }
                } else {
                    if(LSitem){
                        setDescriptionValue(LSitem);
                    }
                }
            }
        }
    }

    const changeDescription = (value) => {
        setDescriptionValue(value)
        if(setValue) {
            setValue(value)
        }
        if(task) {
            const LSkey = 'task_description_' + task.id;
            localStorage.setItem(LSkey, value);
        }
    }

    const saveDescription = (isFocus) => {
        if(descriptionValue !== '') {
            fetchParsedownText(descriptionValue);
        }

        if(task) {
            if(isFocus) {
                fetchChangeTaskDescription(task.id, descriptionValue)
            }
        } else {
            setOpenDescriptionEdit(false);
            setDescriptionValueHtml(descriptionValue)
            if(setValue) {
                setValue(descriptionValue)
            }
        }
    }

    const onCancelDescription = (e) => {
        e.stopPropagation()
        setOpenDescriptionEdit(false);

        if(task) {
            const LSkey = 'task_description_orig_' + task.id;
            const LSitem = localStorage.getItem(LSkey);
            if(LSitem){
                setDescriptionValue(LSitem);
            }
        }
    }

    return (
        <div className='task-description__holder'>
            <div
                className={'task-description__input' + (openDescriptionEdit ? ' open' : '')}
                ref={descriptionInputRef}
            >
                {!openDescriptionEdit && descriptionValueHtml &&
                    <div className='task-description__input-html'
                         dangerouslySetInnerHTML={{__html: descriptionValueHtml}}
                         onClick={onFocusDescription}
                    ></div>
                }
                {!openDescriptionEdit && !descriptionValueHtml &&
                    <textarea
                        className='task-description__input-html empty'
                        onClick={onFocusDescription}
                        placeholder='Напишите описание...'
                    ></textarea>
                }
                {openDescriptionEdit &&
                    <MyTextarea
                        classes={["task-description__input-change"]}
                        placeholder='Напишите описание...'
                        onChange={changeDescription}
                        defaultValue={descriptionValue}
                        value={descriptionValue}
                        onFocus={onFocusDescription}
                        defaultHeight={40}
                        autoFocus={true}
                        disableEnter={true}
                        textareaEnterHandler={(isFocus) => saveDescription(isFocus)}
                    />
                }
                {openDescriptionEdit &&
                    <div className='task-description__input-btns'>
                        <MyButtonBlue
                            onClick={() => saveDescription(true)}
                        >
                            Сохранить
                        </MyButtonBlue>
                        <MyButton classes={["desc-close"]} onClick={onCancelDescription}>Отменить</MyButton>
                    </div>
                }
            </div>
        </div>
    );
};

export default TaskDescription;