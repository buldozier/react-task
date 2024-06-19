import React, {forwardRef} from 'react';
import {Link} from "react-router-dom";
import './NotificationItem.scss'
import {getNotificationDateString, makeInitials} from "../../../helpers/helpers";
import {mainUrl, mainUrlOrigin} from "../../../constants/constants";
import {useFetching} from "../../../hooks/useFetching";
import PostService from "../../../API/PostService";
import {useDispatch} from "react-redux";
import {changeNotificationAction, changeViewedNotificationAction} from "../../../store/notificationReducer";
import {changeCurrentProjectTaskAction} from "../../../store/currentProject";

const NotificationItem = forwardRef(({notification, closeDropdown, isShowReadNotifications}, ref) => {

	const dispatch = useDispatch()

	const [fetchMarkTaskAsViewed] = useFetching(async (taskId) => {
		await PostService.markTaskAsViewed(taskId)
	})

	const [fetchMarkCommentsAsViewed] = useFetching(async (ids) => {
		await PostService.markCommentAsViewed(ids)
	})

	const [fetchMarkChangeStageAsViewed] = useFetching(async (id) => {
		await PostService.markChangeStageAsViewed(id)
	})

	const getTypeName = () => {
		let res = '';
		// 5 - addTask, 6 - addComment, 13 - changeStage
		switch (notification.type) {
			case '5':
				res = 'Новая задача: '
				break;
			case '6':
				res = `Новый комментарий в задаче: `
				break;
			case '13':
				res = 'Изменен статус задачи: '
				break;
			default:
				break
		}
		return res
	}

	const getNotificationLink = () => {
		//#TODO Добавить в url строку slug
		let res = `${mainUrlOrigin}/${notification.project_id}/${notification.task_id}/`

		if(notification.task_comment_id) {
			res += '#' + notification.task_comment_id
		}

		return res
	}

	const onMouseEnterHandler = () => {
		if(notification.viewed === '0') {
			switch (notification.type) {
					// 5 - addTask, 6 - addComment, 13 - changeStage
				case '5':
					fetchMarkTaskAsViewed(notification.data_id)
					dispatch(changeCurrentProjectTaskAction({id: notification.task_id, new: false}))
					break;
				case '6':
					fetchMarkCommentsAsViewed(notification.data_id)
					dispatch(changeCurrentProjectTaskAction({id: notification.task_id, has_new_comments: false}))
					break;
				case '13':
					fetchMarkChangeStageAsViewed(notification.data_id)
					break;
				default:
					break
			}
			dispatch(changeNotificationAction({...notification, viewed: '1'}))
			dispatch(changeViewedNotificationAction({data: {...notification, viewed: '1'}, delItem: false}))

			if(!isShowReadNotifications) {
				dispatch(changeViewedNotificationAction({data: {...notification, viewed: '1'}, delItem: true}))
			}


		}
	}

	return (
			<Link
					to={getNotificationLink()}
					onClick={() => closeDropdown()}
					className={`notification-item${notification.viewed === '0' ? ' not-viewed' : ''}`} ref={ref}
					onMouseEnter={onMouseEnterHandler}
			>
				<div className='notification-item__inner'>
					<div className='notification-item__top'>
						<div className='notification-item__user-img-holder'>
							{notification.sender.personal_photo_src
								? <img className='notification-item__user-img'
										 src={mainUrl + notification.sender.personal_photo_src}
										 alt={notification.sender.full_name}
								/>
								: <div className='notification-item__user-img-no-photo'>
									{makeInitials(notification.sender.full_name)}
								</div>
							}

						</div>
						<div className='notification-item__content'>
							<div className='notification-item__content-title'>
								<div className='notification-item__name-date'>
									<div className='notification-item__top-left'>{notification.sender.full_name}</div>
									<div className='notification-item__top-right'>
										{notification.viewed === '0' &&
												<div className='notification-item__is-read'></div>
										}
										<div
												className='notification-item__date'>{getNotificationDateString(notification.date_create * 1000)}</div>
									</div>
								</div>
								<span>{getTypeName()}</span>
								{notification.task_name &&
										<span className='notification-item__task-name'>{notification.task_name}</span>
								}
							</div>
							{notification.comment_text &&
									<div
											className='notification-item__content-body'
									>
										<div className='notification-item__content-body-text'
												dangerouslySetInnerHTML={{__html: notification.comment_text}}
										></div>
									</div>
							}
							{notification.new_stage &&
									<div className='notification-item__content-status'>
										{notification.prev_stage
											? <span>{notification.prev_stage}</span>
											: <span>???</span>
										}
										<svg xmlns="http://www.w3.org/2000/svg" width="27px" height="14px" viewBox="0 0 27 14" version="1.1">
											<g id="Page-2-Copy" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
												<g id="5" stroke="#979797" transform="translate(-5.000000, -9.000000)" fillRule="nonzero"
													 fill="#2A2630">
													<path
															d="M10.0502525,22.8786797 L10.0502525,17.1923882 C10.0502525,16.6401034 9.60253728,16.1923882 9.05025253,16.1923882 C8.49796778,16.1923882 8.05025253,16.6401034 8.05025253,17.1923882 L8.05025253,25.1923882 C8.05025253,25.7446729 8.49796778,26.1923882 9.05025253,26.1923882 L17.0502525,26.1923882 C17.6025373,26.1923882 18.0502525,25.7446729 18.0502525,25.1923882 C18.0502525,24.6401034 17.6025373,24.1923882 17.0502525,24.1923882 L11.5649712,24.1923882 L27.29056,8.46679929 C27.6823729,8.07498641 27.6861402,7.44349949 27.2928932,7.05025253 C26.9023689,6.65972824 26.2666842,6.66224797 25.8763465,7.05258573 L10.0502525,22.8786797 Z"
															id="Rectangle-348" stroke="none"
															transform="translate(18.000000, 16.142136) rotate(-135.000000) translate(-18.000000, -16.142136) "/>
												</g>
											</g>
										</svg>
										<span>{notification.new_stage}</span>
									</div>
							}
						</div>

					</div>
					<div className='notification-item__bottom'>
						<div className='notification-item__project-name'>{notification.project_name}</div>

					</div>
				</div>
			</Link>
	);
});

export default NotificationItem;