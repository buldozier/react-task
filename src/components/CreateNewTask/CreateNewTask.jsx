import React, {useState} from 'react';
import './CreateNewTask.scss'
import MyTextarea from "../UI/MyTextaerea/MyTextarea";
import Modal from "../UI/Modal/Modal";
import TaskDescription from "../Task/TaskDescription/TaskDescription";
import MyButtonBlue from "../UI/MyButtonBlue/MyButtonBlue";
import TaskSidebar from "../Task/TaskSidebar/TaskSidebar";
import MyButton from "../UI/MyButton/MyButton";
import {useFetching} from "../../hooks/useFetching";
import PostService from "../../API/PostService";
import {useParams} from "react-router-dom";
import {setCurrentProjectTasksAction} from "../../store/currentProject";
import {useDispatch} from "react-redux";

const CreateNewTask = ({onClose, isCreatingNewTask}) => {
	const params = useParams()
	const dispatch = useDispatch()


	const [newTaskName, setNewTaskName] = useState('')
	const [newDescriptionValue, setNewDescriptionValue] = useState('')
	const [newDeadline, setNewDeadline] = useState('')
	const [newTimeSpentHours, setNewTimeSpentHours] = useState('')
	const [newTimeSpentMinutes, setNewTimeSpentMinutes] = useState('')
	const [newSelectedTags, setNewSelectedTags] = useState([])


	const [fetchCreateNewTask] = useFetching(async (projectId, taskName, description, deadline, timeSpent, newSelectedTags) => {
		const response = await PostService.createNewTask(projectId, taskName, description, deadline, timeSpent, newSelectedTags)
		if (response.data.success && response.data.result !== false) {
			fetchCurrentProjectTasks(params.id)
		}
	})

	const [fetchCurrentProjectTasks] = useFetching(async (projectId) => {
		const response = await PostService.getCurrentProjectTasks(projectId)
		if (response.data.success && response.data.result !== false) {
			dispatch(setCurrentProjectTasksAction(response.data.result))
			isCreatingNewTask(false)
		}
	})

	const createNewTask = () => {
		const timeSpent = newTimeSpentHours * 3600 + newTimeSpentMinutes * 60
		if(newDeadline) {
			const deadlineLocaleDate = newDeadline.toLocaleDateString()
		}

		console.log('newTaskName', newTaskName)
		console.log('newDescriptionValue', newDescriptionValue)
		console.log('newDeadline', new Date(newDeadline))
		console.log('timeSpent', timeSpent)
		console.log('newSelectedTags', newSelectedTags)
		isCreatingNewTask(true)
		fetchCreateNewTask(
				params.id,
				newTaskName,
				newDescriptionValue,
				newDeadline ? newDeadline.toLocaleDateString() : newDeadline,
				timeSpent,
				newSelectedTags)
		onClose();
	}

	return (
		<Modal classes={['new-task']} closeModalHandler={onClose}>
			<div className='new-project-task__title'>
				<MyTextarea
					classes={['new-project-task__title-input']}
					value={newTaskName}
					onChange={setNewTaskName}
					placeholder={'Введите задание новой задачи'}
				/>
			</div>
			<div className='new-project-task__main'>
				<div className="new-project-task__content">
					<div className='new-project-task__item new-project-task__description'>
						<div className='new-project-task__description-title'>
							<h3>Описание</h3>
						</div>
						<TaskDescription setValue={setNewDescriptionValue}/>
					</div>
				</div>
				<TaskSidebar
					setNewDeadline={setNewDeadline}
					setNewTimeSpentHours={setNewTimeSpentHours}
					setNewTimeSpentMinutes={setNewTimeSpentMinutes}
					newSelectedTags={newSelectedTags}
					setNewSelectedTags={setNewSelectedTags}
				/>
			</div>
			<div className='new-project-task__bottom'>
				<MyButtonBlue
					isDisabled={newTaskName === ''}
					onClick={createNewTask}
				>Создать задачу</MyButtonBlue>
				<MyButton
					classes={['new-project-task__cancel']}
					onClick={onClose}
				>Отменить</MyButton>
			</div>
		</Modal>
	);
};

export default CreateNewTask;