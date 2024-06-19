import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import { useFetching } from '../../../hooks/useFetching';
import PostService from '../../../API/PostService';
import "./TaskTags.scss"
import Dropdown from '../../UI/Dropdown/Dropdown';
import MyCustomCheckbox from '../../UI/MyCustomCheckbox/MyCustomCheckbox';
import { changeCurrentProjectTaskAction, setCurrentProjectInfoAction } from '../../../store/currentProject';

export const TaskTagsEdit = ({task, closeDropdown = false, setSelectedTagsNewTask, newSelectedTags}) => {
    const dispatch = useDispatch();

    const projectInfo = useSelector(state => state.currentProject.currentProjectInfo);
    const projectInfoTags = projectInfo.tags ? projectInfo.tags : [];
    const [projectTagsList, setProjectTagsList] = useState([])
    const [selectedTags, setSelectedTags] = useState([]);

    const [showAdd, setShowAdd] = useState(false);
    const [newTagValue, setNewTagValue] = useState('');

    useEffect(() => {
        setSelectedTags(task.tags ? task.tags.map((el) => {return el.id}) : [])
    }, [task]);

    useEffect(() => {
        setProjectTagsList(projectInfoTags)
    }, [projectInfoTags]);

    useEffect(() => {
        if (newSelectedTags) {
            setSelectedTags(newSelectedTags)
        }
    }, [newSelectedTags]);

    const onClose = () => {
        if(closeDropdown) closeDropdown();
    }

    const updateSelectedTags = (state, id) => {

        if(state){
            selectedTags.push(id);
        } else {
            const index = selectedTags.indexOf(id);
            selectedTags.splice(index, 1);
        }

        setSelectedTags(selectedTags);

        if(setSelectedTagsNewTask) {
            setSelectedTagsNewTask(selectedTags);
        }

        if(task) {
            let newTaskTags = selectedTags.map((tagID) => {
                return projectInfoTags.find((el) => {return el.id === tagID});
            })

            fetchUpdateTaskTags(task.id, selectedTags);
            task.tags = newTaskTags;
            dispatch(changeCurrentProjectTaskAction(task));
        }
    }

    const addTag = (e) => {
        e.stopPropagation();
        setShowAdd(true);
    }

    const addNewTag = (e) => {
        e.stopPropagation();
        if(newTagValue !== ''){
            fetchAddTag(newTagValue, projectInfo.id);
        } else {
            setShowAdd(false);
            setNewTagValue('');
        }
    }

    const [fetchAddTag] = useFetching(async (name, projectId) => {
        const response = await PostService.addTag(name, projectId);
        if (response.data.success && response.data.result !== false) {
            projectInfo.tags.push({
                id: String(response.data.result),
                name: name,
                project: projectId,
            });
            dispatch(setCurrentProjectInfoAction(projectInfo));
            setShowAdd(false);
            setNewTagValue('');
        }
    })

    const [fetchUpdateTaskTags] = useFetching(async (taskId, ids) => {
        await PostService.updateTaskTags(taskId, ids)
    })

    return(
        <Dropdown onClose={onClose} title={'Теги'}>
            <div className='tags'>
                <div className="tags__list">
                    {
                        projectTagsList.map((tag) => {
                            return(
                                <TaskTagsItem
                                    key={tag.id}
                                    tag={tag}
                                    selectedTags={selectedTags}
                                    updateSelectedTags={updateSelectedTags}
                                    projectInfo={projectInfo}
                                />
                            );
                        })
                    }
                    {
                        showAdd ?
                        <div className='tags__add'>
                            <input type='text' value={newTagValue} onChange={(e) => setNewTagValue(e.target.value)}/>
                            <button className='tags__add-btn' onClick={addNewTag}></button>
                        </div> :
                        <button className='tags__btn' onClick={addTag}>Добавить</button>
                    }
                </div>
            </div>
        </Dropdown>
    )
}
const TaskTagsItem = ({tag, selectedTags, updateSelectedTags, projectInfo}) => {
    const dispatch = useDispatch();

    const [editing, isEditing] = useState(false);
    const [tagName , setTagName] = useState(tag.name);

    const onInputBlur = (e) => {
        updateTagName(e.target.value);
    }

    const onKeyDown = (e) => {
        if(e.code === 'Enter' || e.keyCode === 13){
            updateTagName(e.target.value);
        }
    }

    const updateTagName = (value) => {
        isEditing(false);
        if(tag.name !== value) fetchUpdateTag(tag.id, value)
    }

    const [fetchUpdateTag] = useFetching(async (tagId, value) => {
        await PostService.updateTag(tagId, value);
        let projectTags = projectInfo.tags ? projectInfo.tags : [];
        projectInfo.tags = projectTags.map((el) => {
            if(el.id === tagId) el.name = value;
            return el;
        });
        dispatch(setCurrentProjectInfoAction(projectInfo))
    })

    return (
        <div className='tags__list-item'>
            <MyCustomCheckbox defaultState={selectedTags.indexOf(tag.id) !== -1} onChange={(state) => {updateSelectedTags(state, tag.id)}}/>
            <div className="tags__list-item-name">
                {
                    editing ?
                    <input type='text' value={tagName} onChange={(e) => setTagName(e.target.value)} onBlur={onInputBlur} onKeyDown={onKeyDown}/> :
                    <>{tagName}</>
                }
            </div>
            <button className="tags__list-item-edit" onClick={() => isEditing(!editing)}></button>
        </div>
    );
}
