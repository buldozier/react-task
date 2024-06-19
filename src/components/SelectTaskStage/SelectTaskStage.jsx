import React, {useEffect, useState} from 'react';
import "./SelectTaskStage.scss"
import MyButtonBlue from "../UI/MyButtonBlue/MyButtonBlue";
import {useFetching} from "../../hooks/useFetching";
import PostService from "../../API/PostService";
import {setCurrentProjectTasksAction} from "../../store/currentProject";
import {useDispatch} from "react-redux";
import {useParams} from "react-router-dom";
import Dropdown from "../UI/Dropdown/Dropdown";

const SelectTaskStage = ({
        closeSelectTaskStage,
        projectColumns,
        currentStage,
        columnTasks,
        projectTasks,
        classes
    }) => {
    const params = useParams()
    const dispatch = useDispatch()
    const [newStage, setNewStage] = useState('')
    const [newSort, setNewSort] = useState(1)
    const [currentColumnTasks, setCurrentColumnTasks] = useState([])
    const [isEmptyColumn, setIsEmptyColumn] = useState(false)

    const [fetchMoveTask] = useFetching(async (taskId, newSort, newStage, prevStage) => {
        const response = await PostService.moveTask(taskId, newSort, newStage)
        if (response.data.success && response.data.result !== false) {
            fetchPositionTask(taskId, newSort, newStage, prevStage)
        }
    })
    const [fetchPositionTask] = useFetching(async (taskId, newSort, newStage, prevStage) => {
        const response = await PostService.positionTask(taskId, newSort, newStage, prevStage)
        if (response.data.success && response.data.result !== false) {
            fetchCurrentProjectTasks(params.id)
        }
    })

    const [fetchCurrentProjectTasks] = useFetching(async (projectId) => {
        const response = await PostService.getCurrentProjectTasks(projectId)
        if (response.data.success && response.data.result !== false) {
            dispatch(setCurrentProjectTasksAction(response.data.result))
        }
    })

    useEffect(() => {
        setNewStage(currentStage)
        setCurrentColumnTasks(columnTasks)
    }, []);

    const changeStage = (e) => {
        const value = e.target.value
        setNewStage(value)
        const stageTasks = projectTasks.filter(task => task.stage === value)
        if (stageTasks.length > 0) {
            setIsEmptyColumn(false)
        } else {
            setIsEmptyColumn(true)
        }
        setCurrentColumnTasks(stageTasks)
        setNewSort(1)
    }

    const changeSort = (e) => {
        const value = e.target.value
        setNewSort(value)
    }

    const moveCard = (e) => {
        fetchMoveTask(params.taskId, newSort, newStage, currentStage)
        closeSelectTaskStage(e)
    }

    return (
        <Dropdown classes={classes} onClose={closeSelectTaskStage} title={'Перемещение карточки'}>
            <div className='select-stage__inputs'>
                <div className='select-stage__input select-stage__input--column'>
                    <label>Колонка</label>
                    <select name="select-stage" onChange={changeStage} value={newStage}>
                        {projectColumns.map(column => {
                            return (
                                <option
                                    value={column.stageId}
                                    onClick={() => setNewStage(column.stageId)}
                                    key={column.stageId}
                                >
                                    {column.stageName}
                                </option>
                            );
                        })
                        }
                    </select>
                </div>
                <div className='select-stage__input'>
                    <label>Позиция</label>
                    <select onChange={changeSort} value={newSort}>
                        {currentColumnTasks.map((item, index) => {
                            return (
                                <option
                                    value={index + 1}
                                    onClick={() => setNewSort(index + 1)}
                                    key={index + 1}
                                >
                                    {index + 1}
                                </option>
                            )
                        })
                        }
                        {!isEmptyColumn && currentStage !== newStage &&
                            <option value={currentColumnTasks.length + 1}>{currentColumnTasks.length + 1}</option>
                        }
                        {isEmptyColumn &&
                            <option value="1">1</option>
                        }
                    </select>
                </div>
            </div>
            <MyButtonBlue
                onClick={moveCard}
            >
                Переместить
            </MyButtonBlue>
        </Dropdown>
    );
};

export default SelectTaskStage;