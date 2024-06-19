import React, {useEffect, useRef, useState} from 'react';
import "./ProjectTask.scss"
import {getDateString} from "../../../helpers/helpers";
import {Link, useParams} from "react-router-dom";
import {
    setCurrentDraggableTaskAction,
    setCurrentDraggableTaskHeightAction,
    setCurrentProjectTasksAction
} from "../../../store/currentProject";
import {useDispatch, useSelector} from "react-redux";
import {useFetching} from "../../../hooks/useFetching";
import PostService from "../../../API/PostService";
import { TaskCheckLists } from '../../Task/TaskCheckLists/TaskCheckLists';

const ProjectTask = ({task, projectId, taskSortNumber}) => {
  const refCard = useRef(null)
  const dispatch = useDispatch()
	const params = useParams()

  const currentDraggableTask = useSelector(state => state.currentProject.currentDraggableTask)
	const currentDraggableTaskHeight = useSelector(state => state.currentProject.currentDraggableTaskHeight)
	const projectTasks = useSelector(state => state.currentProject.currentProjectTasks)

	const [statusDraggableTask, refreshStatusDraggableTask] = useState(false);
  const [topOrBottomDraggableTask, setTopOrBottomDraggableTask] = useState('')
  const [colorDeadline, setColorDeadline] = useState('')

  const [fetchMoveTask] = useFetching(async (taskId, newSort, newStage, prevStage) => {
		const response = await PostService.moveTask(taskId, newSort, newStage)
		if (response.data.success && response.data.result !== false) {
				fetchPositionTask(taskId, newSort, newStage, prevStage)
		}
  })
  const [fetchPositionTask] = useFetching(async (taskId, newSort, newStage, prevStage) => {
		await PostService.positionTask(taskId, newSort, newStage, prevStage)
  })

  const dragStartHandler = (e, task) => {
		refCard.current.classList.add('drag-start-card')
		dispatch(setCurrentDraggableTaskAction({...task, taskSortNumber: taskSortNumber}))
		dispatch(setCurrentDraggableTaskHeightAction(refCard.current.offsetHeight));
  }
  const dragLeaveHandler = (e) => {
		e.preventDefault()
    refreshStatusDraggableTask(false);
  }

  const dragEndHandler = () => {
      refCard.current.classList.remove('drag-start-card')
    const columnDraggableTasks = document.querySelectorAll('.project-task__draggable');

    if(columnDraggableTasks.length > 0) {
	    columnDraggableTasks.forEach(el => {
		    el.style.height = 0
		    el.style.opacity = 0;
		    el.style.marginBottom = '';
	    })
    }
  }

  const dragOverHandler = (e) => {
		e.preventDefault()

		let pos = refCard.current.getBoundingClientRect();
		let elem_top = pos.top;
		let y = e.pageY - elem_top;

		if (!statusDraggableTask) {
			setTopOrBottomDraggableTask('');
			refreshStatusDraggableTask(true);
		}

			if (y < pos.height / 2) {
				if (topOrBottomDraggableTask !== 'top') {
						setTopOrBottomDraggableTask('top');
				}
			} else {
				if (topOrBottomDraggableTask !== 'bottom') {
						setTopOrBottomDraggableTask('bottom');
				}
			}
	}

	useEffect(() => {
		if (task.date_deadline_state > 0) {
			setColorDeadline(' green')
		} else {
			setColorDeadline('')
		}
	}, [task, params.taskId]);

	useEffect(() => {
		const refCardChildren = refCard.current.children[0];
		const refCardChildrenNext = refCard.current.nextSibling.children[0];

			if (topOrBottomDraggableTask === 'top') {
				refCardChildren.style.height = currentDraggableTaskHeight + 'px'
				refCardChildren.style.opacity = 1;
				refCardChildren.style.marginBottom = '7px';

				if(refCard.current.nextSibling) {
					refCardChildrenNext.style.height = ''
					refCardChildrenNext.style.opacity = 0;
					refCardChildrenNext.style.marginBottom = '';
				}
			}

			if (topOrBottomDraggableTask === 'bottom') {
				refCardChildren.style.height = 0
				refCardChildren.style.opacity = 0;
				refCardChildren.style.marginBottom = '';

				if(refCard.current.nextSibling) {
					refCardChildrenNext.style.height = currentDraggableTaskHeight + 'px'
					refCardChildrenNext.style.opacity = 1;
					refCardChildrenNext.style.marginBottom = '7px';
				}
			}
	}, [topOrBottomDraggableTask, setTopOrBottomDraggableTask]);

	const dropHandler = (e, dropTask, taskSortNumber) => {
		e.preventDefault()
		const refCardChildren = refCard.current.children[0];
		const refCardChildrenNext = refCard.current.nextSibling.children[0];
		let currentIndex = null;
			refCard.current.classList.remove('drag-start-card')

			if (
					((Number(taskSortNumber) === currentDraggableTask.taskSortNumber && topOrBottomDraggableTask) ||
							(Number(taskSortNumber) === currentDraggableTask.taskSortNumber + 1 && topOrBottomDraggableTask === 'top')) &&
					dropTask.stage === currentDraggableTask.stage
			) {
					return false;
			} else {
				if (topOrBottomDraggableTask === 'bottom') {
						fetchMoveTask(currentDraggableTask.id, Number(taskSortNumber) + 1, dropTask.stage, currentDraggableTask.stage)
					refCardChildrenNext.style.display = 'none'
				} else {
						fetchMoveTask(currentDraggableTask.id, Number(taskSortNumber), dropTask.stage, currentDraggableTask.stage)
					refCardChildren.style.display = 'none'
				}
			}

			const result = projectTasks.map((task, index) => {
				if (topOrBottomDraggableTask === 'bottom') {
					if (task.stage === dropTask.stage && task.sort > dropTask.sort) {
						task.sort++
					}

					if (task.id === currentDraggableTask.id) {
						task.stage = dropTask.stage
						task.sort = +dropTask.sort + 1
					}
				} else if (topOrBottomDraggableTask === 'top') {
					if (task.stage === dropTask.stage && task.sort >= dropTask.sort) {
						task.sort++
					}

					if (task.id === currentDraggableTask.id) {
						if (currentIndex !== null) {
							task.sort = +dropTask.sort - 1
						} else {
							task.sort = +dropTask.sort
						}

						task.stage = dropTask.stage
					}

					if (task.id === dropTask.id) {
						currentIndex = index;
					}
				}
				return task
			})
		dispatch(setCurrentDraggableTaskHeightAction(''));
			dispatch(setCurrentProjectTasksAction(result))

		setTimeout(() => {
			refCardChildren.style.display = 'block'
			refCardChildrenNext.style.display = 'block'
		}, 200)
	}

	return (
			<Link
					to={'/' + projectId + '/' + task.id + '/' + task.slug + '/'}
					className="project-task"
					draggable={true}
					ref={refCard}
					data-id={task.id}
					onDragStart={e => dragStartHandler(e, task)}
					onDragLeave={e => dragLeaveHandler(e)}
					onDragEnd={e => dragEndHandler(e)}
					onDragOver={e => dragOverHandler(e)}
					onDrop={e => dropHandler(e, task, taskSortNumber)}
			>
					<div className="project-task__draggable"></div>
					<div className='project-task__wrapper'>
							{(task.new || task.has_new_comments) &&
									<span className='project-task__marked'></span>
							}
							<div className='project-task__bottom'>
									{task.name}
							</div>
							{task.date_deadline_string &&
									<div className={'project-task__footer' + colorDeadline}>
										<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
												stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
											<circle cx="12" cy="12" r="10"/>
											<polyline points="12 6 12 12 16 14"/>
										</svg>
										{getDateString(task.date_deadline * 1000, task.date_deadline_string, true)}
									</div>
							}
							{
								task.check_lists && Array.isArray(task.check_lists) &&
								<div className="project-task__checklist">
									{
										task.check_lists.map((list) => {
											return(
												<div className="project-task__checklist-item" key={list.id}>{list.counter.checked}/{list.counter.total}</div>
											);
										})
									}
								</div>
							}
							{
								task.tags && Array.isArray(task.tags) &&
								<div className='project-task__tags'>
									{
										task.tags.map((tag) => {
											return(
												<div className='project-task__tags-item' key={tag.id} data-tag-id={tag.id}>#{tag.name}</div>
											)
										})
									}
								</div>
							}
					</div>
			</Link>
	);
};

export default ProjectTask;
