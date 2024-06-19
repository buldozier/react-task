import React, {useEffect, useState} from 'react';
import TaskCommentList from "../TaskCommentList/TaskCommentList";
import {useDispatch} from "react-redux";
import {useFetching} from "../../../hooks/useFetching";
import PostService from "../../../API/PostService";
import {changeCurrentProjectTaskAction} from "../../../store/currentProject";
import {useParams} from "react-router-dom";
import TaskCommentCreate from "../TaskCommentCreate/TaskCommentCreate";

const TaskComment = ({task, scrollToAction, isLoadingAddTaskCommentTask, isLoadingTaskCommentsTask}) => {
	const dispatch = useDispatch()
	const params = useParams()

	const [comments, setComments] = useState([])
	const [isLoadingAddTaskComment, setIsLoadingAddTaskComment] = useState(false)

	const [fetchMarkCommentsAsViewed] = useFetching(async (ids) => {
		await PostService.markCommentAsViewed(ids)
	})

	const [fetchTaskComments, isLoadingTaskComments] = useFetching(async (id) => {
		const response = await PostService.getTaskComments(id)
		if (response.data.success && response.data.result !== false && response.data.result.length > 0) {
			setComments(response.data.result)
			scrollToAction();
		}
	})

	useEffect(() => {
		isLoadingAddTaskCommentTask(isLoadingAddTaskComment)
	}, [isLoadingAddTaskComment]);

	useEffect(() => {
		isLoadingTaskCommentsTask(isLoadingTaskComments)
	}, [isLoadingTaskComments]);

	useEffect(() => {
		fetchTaskComments(params.taskId)
	}, []);

	useEffect(() => {
		const newComments = [];

		comments.forEach(comment => {
			if (comment.new) {
				newComments.push(comment.id);
			}
		});

		if (newComments.length > 0) {
			fetchMarkCommentsAsViewed(newComments)
			dispatch(changeCurrentProjectTaskAction({id: task.id, has_new_comments: false}))

		}
	}, [comments]);

	const addCommentHolder = (newComment) => {
		setComments([newComment, ...comments])
	}

	return (
		<>
			<TaskCommentCreate
				task={task}
				isLoadingAddTaskCommentTask={setIsLoadingAddTaskComment}
				addComment={addCommentHolder}
			/>
			<TaskCommentList comments={comments}/>
		</>
	);
};

export default TaskComment;