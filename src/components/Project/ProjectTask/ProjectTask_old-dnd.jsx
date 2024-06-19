import React, {useRef, useState} from 'react';
import "./ProjectTask.scss"
import {getDateString} from "../../../helpers/helpers";
import {Link, useParams} from "react-router-dom";
import {setCurrentDraggableTaskAction, setCurrentProjectTasksAction} from "../../../store/currentProject";
import {useDispatch, useSelector} from "react-redux";
import {useFetching} from "../../../hooks/useFetching";
import PostService from "../../../API/PostService";

const ProjectTask = ({task, projectId, taskSortNumber}) => {
    const refCard = useRef(null)
    const params = useParams()
    const dispatch = useDispatch()

    const currentDraggableTask = useSelector(state => state.currentProject.currentDraggableTask)

    const [topOrBottomDropTask, setTopOrBottomDropTask] = useState('')

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

    const dragStartHandler = (e, task) => {
        refCard.current.children[2].classList.add('drag-start-card')
        dispatch(setCurrentDraggableTaskAction(task))
    }
    const dragLeaveHandler = (e) => {
        e.preventDefault()

        refCard.current.children[2].classList.remove('drag-over-card')
        refCard.current.classList.remove('drag-add-block-card-bottom')
        refCard.current.classList.remove('drag-add-block-card-top')

        // if (e.target.classList.contains('project-task__draggable-top')) {
        //
        //     refCard.current.classList.add('drag-add-block-card-bottom')
        // }
        //
        // if (e.target.classList.contains('project-task__draggable-bottom')) {
        //
        //     refCard.current.classList.add('drag-add-block-card-top')
        // }
    }

    const dragEndHandler = () => {
        refCard.current.children[2].classList.remove('drag-start-card')
    }

    const dragOverHandler = (e) => {
        e.preventDefault()

        if (e.target.closest('.project-task__draggable-top')) {
            refCard.current.classList.add('drag-add-block-card-top')
            setTopOrBottomDropTask('top')
        }

        if (e.target.closest('.project-task__draggable-bottom')) {
            refCard.current.classList.add('drag-add-block-card-bottom')
            setTopOrBottomDropTask('bottom')
        }
    }

    const dropHandler = (e, dropTask, taskSortNumber) => {
        e.preventDefault()
        refCard.current.children[2].classList.remove('drag-over-card')
        refCard.current.classList.remove('drag-add-block-card-top')
        refCard.current.classList.remove('drag-add-block-card-bottom')

        if (topOrBottomDropTask === 'bottom') {
            fetchMoveTask(currentDraggableTask.id, Number(taskSortNumber) + 1, dropTask.stage, currentDraggableTask.stage)
        } else {
            fetchMoveTask(currentDraggableTask.id, Number(taskSortNumber), dropTask.stage, currentDraggableTask.stage)
        }

        // const result = projectTasks.map(task => {

            // if (topOrBottomDropTask === 'bottom') {
            //     if (task.stage === dropTask.stage && task.columnOrder > dropTask.columnOrder) {
            //         task.columnOrder++
            //     }
            //
            //     if (task.id === currentDraggableTask.id) {
            //         task.stage = dropTask.stage
            //         task.columnOrder = dropTask.columnOrder + 1
            //     }
            // } else if (topOrBottomDropTask === 'top') {
            //
            //     if (task.stage === dropTask.stage &&
            //         task.columnOrder >= dropTask.columnOrder
            //     ) {
            //         console.log(task.name)
            //         task.columnOrder++
            //     }
            //
            //     if (task.id === currentDraggableTask.id) {
            //
            //         console.log(dropTask.columnOrder)
            //         task.columnOrder = dropTask.columnOrder
            //         task.stage = dropTask.stage
            //     }
            // }



        //     return task
        // })

        // console.log(result)


        // dispatch(setCurrentProjectTasksAction(result))
    }

    return (
        <Link
            to={'/' + projectId + '/' + task.id + '/' + task.slug + '/'}
            className="project-task"
            draggable={true}
            ref={refCard}
            onDragStart={e => dragStartHandler(e, task)}
            onDragLeave={e => dragLeaveHandler(e)}
            onDragEnd={e => dragEndHandler(e)}
            onDragOver={e => dragOverHandler(e)}
            onDrop={e => dropHandler(e, task, taskSortNumber)}
        >
            <div className="project-task__draggable-top"></div>
            <div className="project-task__draggable-bottom"></div>
            <div className='project-task__wrapper'>
                {(task.new || task.has_new_comments) &&
                    <span className='project-task__marked'></span>
                }
                <div className='project-task__bottom'>
                    {task.name}
                </div>
                {task.date_deadline_string &&
                    <div className='project-task__footer'>
                        {getDateString(task.date_deadline, task.date_deadline_string, true)}
                    </div>
                }
            </div>
        </Link>
    );
};

export default ProjectTask;