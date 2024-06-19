import React, {useEffect, useState} from 'react';
import './TaskCommentCreate.scss'
import Person from "../../Person/Person";
import MyCommentTextarea from "../../UI/MyCommentTextarea/MyCommentTextarea";
import MyButtonBlue from "../../UI/MyButtonBlue/MyButtonBlue";
import {useSelector} from "react-redux";
import {useFetching} from "../../../hooks/useFetching";
import PostService from "../../../API/PostService";

const TaskCommentCreate = ({task, isLoadingAddTaskCommentTask, addComment}) => {
	const currentUser = useSelector(state => state.currentUser.currentUser)

	const [isOpenComment, setIsOpenComment] = useState(false)
	const [commentValue, setCommentValue] = useState('');

	const [fetchAddTaskComment] = useFetching(async (id, value) => {
		const response = await PostService.addTaskComment(id, value)
		if (response.data.success && response.data.result !== false) {

		}
	})

	const [fetchParsedownText, isLoadingParsedownText] = useFetching(async (text) => {
		const response = await PostService.getParsedownText(text)
		if (response.data.success && response.data.result !== false) {
			const now = new Date()
			const getDate = () => {
				return now.getDate() < 10 ? "0" + now.getDate() : now.getDate();
			}
			const getMonth = () => {
				return now.getMonth() + 1 < 10 ? "0" + (now.getMonth() + 1) : now.getMonth() + 1;
			}

			const getHours = () => {
				return now.getHours() < 10 ? "0" + now.getHours() : now.getHours();
			}
			const getMinutes = () => {
				return now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes();
			}

			const dateCreateString = `${getDate()}.${getMonth()}.${now.getFullYear()} в ${getHours()}:${getMinutes()}`

			addComment({
				date_create: now.getTime(),
				date_create_string: dateCreateString,
				id: Math.random(),
				new: false,
				task: task.id,
				text: commentValue,
				text_html: response.data.result,
				user: currentUser
			})
		}
	})

	useEffect(() => {
		isLoadingAddTaskCommentTask(isLoadingParsedownText)
	}, [isLoadingParsedownText]);

	useEffect(() => {
		// if (task.description !== '') {
		//     const LSkey2 = 'task_description_' + task.id;
		//     delete localStorage[LSkey2];
		// }

		const LSkey = 'task_comment_' + task.id;
		const LSitem = localStorage.getItem(LSkey);

		if (LSitem) {
			setCommentValue(LSitem)
		}
	}, [task]);

	const onChangeComment = (e) => {
		const value = e.target.value

		setCommentValue(value)

		let LSkey = 'task_comment_' + task.id;
		localStorage.setItem(LSkey, value);

		if (value) {
			localStorage.setItem(LSkey, value);
		} else {
			delete localStorage[LSkey]
		}

		if (value !== "") {
			setIsOpenComment(true)
		} else {
			setIsOpenComment(false)
		}
	}

	const onBlurComment = (e) => {
		const value = e.target.value

		if (value === "") {
			setIsOpenComment(false)
		}
	}

	const onClickComment = (e) => {
		const value = e.target.value

		if (value !== "") {
			setIsOpenComment(true)
		}
	}

	const saveComment = (isFocus) => {
		if(isFocus && commentValue !== '') {
			setIsOpenComment(false)

			fetchAddTaskComment(task.id, commentValue)
			fetchParsedownText(commentValue)

			setCommentValue('');

			let LSkey = 'task_comment_' + task.id;
			delete localStorage[LSkey];
		}
	}

	return (
		<>
			{currentUser.id &&
				<div className='new-comment'>
					<Person person={currentUser} hideName size={'m'}/>
					<div className='new-comment__textarea'>
						<MyCommentTextarea
								placeholder='Напишите комментарий...'
								onChange={onChangeComment}
								onBlur={onBlurComment}
								onClick={onClickComment}
								defaultHeight={40}
								value={commentValue ? commentValue : ''}
								disableEnter={true}
								textareaEnterHandler={(isFocus) => saveComment(isFocus)}
						/>
						{isOpenComment &&
								<MyButtonBlue
										onClick={() => saveComment(true)}
										classes={["new-comment__input-btn"]}
								>
									Сохранить
								</MyButtonBlue>
						}
					</div>
				</div>
			}
		</>
	);
};

export default TaskCommentCreate;