import React, {useEffect, useRef, useState} from 'react';
import "./ProjectColumn.scss"
import ProjectTask from "../ProjectTask/ProjectTask";
import 'react-loading-skeleton/dist/skeleton.css'
import MyLoaderSpinner from "../../UI/MyLoaderSpinner/MyLoaderSpinner";
import {useFetching} from "../../../hooks/useFetching";
import PostService from "../../../API/PostService";
import {
    setCurrentDraggableColumnAction,
    setCurrentDraggableTaskHeightAction,
    setCurrentProjectTasksAction
} from "../../../store/currentProject";
import {useDispatch, useSelector} from "react-redux";
import CreateNewTask from "../../CreateNewTask/CreateNewTask";


const ProjectColumn = ({columnId, projectId, columnStage, columnTasks, isFirstLoadTasks}) => {
    const dispatch = useDispatch()
    const lastItem = useRef()

    const [showLastItem, setShowLastItem] = useState(false)
    const [isCreateNewTask, setIsCreateNewTask] = useState(false);
    const [isCreatingNewTaskHolder, setIsCreatingNewTaskHolder] = useState(false);

    const currentDraggableTask = useSelector(state => state.currentProject.currentDraggableTask)
    const currentDraggableTaskHeight = useSelector(state => state.currentProject.currentDraggableTaskHeight)
    const currentDraggableColumn = useSelector(state => state.currentProject.currentDraggableColumn)
    const projectTasks = useSelector(state => state.currentProject.currentProjectTasks)

    const [fetchMoveTask] = useFetching(async (taskId, newSort, newStage) => {
        const response = await PostService.moveTask(taskId, newSort, newStage)
        if (response.data.success && response.data.result !== false) {
            fetchPositionTask(currentDraggableTask.id, columnTasks.length + 1, columnId)
        }
    })

    const [fetchPositionTask] = useFetching(async (taskId, newSort, newStage) => {
        await PostService.positionTask(taskId, newSort, newStage)
    })

    const removeAllPlaceholderElements = () => {
        const columnDraggableTasks = document.querySelectorAll('.project-task__draggable');
        if(columnDraggableTasks.length > 0) {
            columnDraggableTasks.forEach(el => {
                el.style.height = 0
                el.style.opacity = 0;
                el.style.marginBottom = '';
            })
        }
    }

    const onDragOverHandler = (e) => {
        e.preventDefault()

        if (columnId !== currentDraggableColumn) {
            removeAllPlaceholderElements()
            dispatch(setCurrentDraggableColumnAction(columnId))
        }

        if (e.target.closest('.project-column') && !e.target.closest('.project-column__holder')) {
            if (!showLastItem) {
                setShowLastItem(true)
            }
        }

        if (e.target.closest('.project-column__header')) {
            removeAllPlaceholderElements()
        }

    }

    useEffect(() => {
        if (currentDraggableTaskHeight) {
            lastItem.current.style.height = currentDraggableTaskHeight + 'px'
            lastItem.current.style.opacity = 1;
            lastItem.current.style.marginBottom = '7px';
        }

    }, [showLastItem, setShowLastItem]);

    const onDragLeaveHandler = (e) => {

        if (showLastItem) {
            setShowLastItem(false)
        }

        if(e.target.classList.contains('project-column')) {
            const columnDraggableTasks = document.querySelectorAll('.project-task__draggable');
            if(columnDraggableTasks.length > 0) {
                columnDraggableTasks.forEach(el => {
                    el.style.height = 0
                    el.style.opacity = 0;
                    el.style.marginBottom = '';
                })
            }
        }
    }

    const onDropHandler = (e, columnId) => {
        e.preventDefault()

        const columnDraggableTasks = document.querySelectorAll('.project-task__draggable');
        if(columnDraggableTasks.length > 0) {
            columnDraggableTasks.forEach(el => {
                el.style.height = 0
                el.style.opacity = 0;
                el.style.marginBottom = '';
            })
        }

        if (
            (e.target.closest('.project-column') &&
            !e.target.closest('.project-column__holder')) ||
            e.target.closest('.last-item')
        ) {
            fetchMoveTask(currentDraggableTask.id, columnTasks.length + 1, columnId)

            const result = projectTasks.map(task => {

                if (task.id === currentDraggableTask.id) {

                    let lastColumnSortIndex = 0;
                    projectTasks.forEach(task => {
                        if(+task.stage === +columnId && lastColumnSortIndex < task.sort) {
                            lastColumnSortIndex = task.sort;
                        }
                    })

                    task.stage = columnId
                    task.sort = +lastColumnSortIndex + 1
                }

                return task
            })
            dispatch(setCurrentProjectTasksAction(result))

            lastItem.current.style.display = 'none'

            setTimeout(() => {
                lastItem.current.style.display = 'block'

            }, 200)
        }

        dispatch(setCurrentDraggableTaskHeightAction(''));
    }

    const createCard = () => {
        setIsCreateNewTask(true)
    }

    return (
        <div
            className={'project-column g-custom-scroll project-column--' + columnId + (columnTasks.length === 0 ? ' empty' : '')}
            onDragOver={(e) => onDragOverHandler(e)}
            onDragLeave={(e) => onDragLeaveHandler(e)}
            onDrop={(e) => onDropHandler(e, columnId)}
        >
            <div className="project-column__holder">
                <div className='project-column__header'>
                    <div className='project-column__header-top'>
                        <h3>{columnStage}</h3>
                        {isFirstLoadTasks
                            ? <div className='project-column__count'>{columnTasks.length}</div>
                            : <MyLoaderSpinner classes={['count-spinner']}/>
                        }
                    </div>
                    {columnId === 1 &&
                        <div className={`project-column__header-add ${isCreatingNewTaskHolder ? 'disabled' : ''}`}>
                            <button
                                className='project-column__header-add-btn'
                                onClick={createCard}
                            >
                                Добавить задачу
                            </button>
                            {isCreatingNewTaskHolder &&
                                <MyLoaderSpinner/>
                            }
                        </div>
                    }
                    {columnId === 1 && isCreateNewTask &&
                        <CreateNewTask
                            onClose={() => setIsCreateNewTask(false)}
                            isCreatingNewTask={(state) => setIsCreatingNewTaskHolder(state)}
                        />
                    }
                </div>
                <div className='project-column__wrapper'>
                    <div className='project-column__wrapper-scroll g-hide-scrollbar'>
                        {columnTasks && columnTasks.map((task, index) =>
                            <ProjectTask
                                key={task.id}
                                projectId={projectId}
                                task={task}
                                taskSortNumber={index + 1}
                            />
                        )}
                        <div className='project-task last-item'>
                            <div ref={lastItem} className="project-task__draggable"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectColumn;