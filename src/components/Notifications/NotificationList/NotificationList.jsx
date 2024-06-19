import React, {createRef, useEffect, useRef, useState} from 'react';
import './NotificationList.scss'
import NotificationItem from "../NotificationItem/NotificationItem";
import {useDispatch, useSelector} from "react-redux";
import {setIsShowReadNotificationsAction} from "../../../store/currentUserReducer";
import {useFetching} from "../../../hooks/useFetching";
import PostService from "../../../API/PostService";
import {
	deleteViewedNotificationsAction,
	setNotificationsAction,
	setViewedNotificationsAction, updateNotificationsAction, updateViewedNotificationsAction,
} from "../../../store/notificationReducer";
import MyLoaderSpinner from "../../UI/MyLoaderSpinner/MyLoaderSpinner";

const NotificationList = ({closeDropdown}) => {
	const dispatch = useDispatch()
	const dropdownRef = useRef()
	const notificationListRef = useRef()
	const lastItem = createRef();
	//константа для хранения идентификатора наблюдателя
	const observerLoader = useRef();
	const currentUser = useSelector(state => state.currentUser.currentUser)
	const isShowReadNotifications = useSelector(state => state.currentUser.isShowReadNotifications)
	const notificationList = useSelector(state => state.notifications.notifications)
	const viewedNotificationList = useSelector(state => state.notifications.viewedNotifications)
	const [notifications, setNotifications] = useState([]);
	const [canFetchMoreNotifications, setCanFetchMoreNotifications] = useState(true);
	const [canFetchMoreViewedNotifications, setCanFetchMoreViewedNotifications] = useState(true);

	const [fetchNotificationList, isLoadingNotificationList] = useFetching(async (limit, offset, id, dateFilter) => {
		const response = await PostService.getNotifications(limit, offset, id, dateFilter)
		if (response.data.success && response.data.result !== false) {
			if(!dateFilter) {
				dispatch(setNotificationsAction(response.data.result))
			} else {
				dispatch(updateNotificationsAction(response.data.result))
			}
		}

		if(offset > 0 && response.data.result && response.data.result.length === 0 && !dateFilter) {
			setCanFetchMoreNotifications(false);
		}
	})

	const [fetchViewedNotificationList, isLoadingFetchViewedNotificationList] = useFetching(async (limit, offset, id, dateFilter) => {
		const response = await PostService.getViewedNotifications(limit, offset, id, dateFilter)
		if (response.data.success && response.data.result !== false) {
			if(!dateFilter) {
				dispatch(setViewedNotificationsAction(response.data.result))
			} else {
				dispatch(updateViewedNotificationsAction(response.data.result))
			}
		}

		if(offset > 0 && response.data.result && response.data.result.length === 0 && !dateFilter) {
			setCanFetchMoreViewedNotifications(false);
		}
	})


	//действия при изменении последнего элемента списка
	useEffect(() => {
		setTimeout(() => {
			//удаляем старый объект наблюдателя
			if (observerLoader.current) {
				observerLoader.current.disconnect();
			}

			//создаём новый объект наблюдателя
			observerLoader.current = new IntersectionObserver(actionInSight);

			//вешаем наблюдателя на новый последний элемент
			if (lastItem.current) {
				observerLoader.current.observe(lastItem.current);
			}
		}, 300)
	}, [lastItem]);

	useEffect(() => {
		setNotifications(notificationList);

		observerLoader.current = new IntersectionObserver(actionInSight)
		if (lastItem.current) {
			observerLoader.current.observe(lastItem.current);
		}
		document.addEventListener('click', documentClickHandler);

		return () => document.removeEventListener('click', documentClickHandler);
	}, []);

	useEffect(() => {
		if(isShowReadNotifications) {
			setNotifications(viewedNotificationList);
		} else {
			setNotifications(notificationList);
		}
	}, [isShowReadNotifications, notificationList, viewedNotificationList]);

	useEffect(() => {
		dispatch(deleteViewedNotificationsAction())
	}, [isShowReadNotifications]);

	const documentClickHandler = (e) => {
		if(!dropdownRef.current) return;
		if(!dropdownRef.current.contains(e.target) && !e.target.classList.contains('notifications')){
			closeDropdown();
		}
	};

	const changeIsReadNotificationHandler = () => {
		notificationListRef.current.scrollTo(0, 0);
		dispatch(setIsShowReadNotificationsAction(!isShowReadNotifications))
	}

	const actionInSight = (entries) => {
		if (entries[0].isIntersecting && !isLoadingNotificationList && !isLoadingFetchViewedNotificationList) {
			if(isShowReadNotifications && canFetchMoreViewedNotifications && viewedNotificationList.length >= 25) {
				fetchViewedNotificationList(25, viewedNotificationList.length, currentUser.id);
			} else if(!isShowReadNotifications && canFetchMoreNotifications && notificationList.length >= 25) {
				fetchNotificationList(25, notificationList.length, currentUser.id);
			}
		}
	};

	return (
			<div className='notification-list' ref={dropdownRef}>
				<div className='notification-list__title'>
					<h2>Уведомления</h2>
					<div className='notification-list__switch'>
						<div className='notification-list__switch-text'>Только непрочитанные</div>
						<div
								className={`notification-list__switch-btn${isShowReadNotifications ? ' show-read' : ''}`}
								onClick={changeIsReadNotificationHandler}
						>
							<span className='notification-list__switch-btn-svg'>
								<svg width="24" height="24" viewBox="0 0 24 24" role="presentation">
									<path
											d="M7.356 10.942a.497.497 0 00-.713 0l-.7.701a.501.501 0 00-.003.71l3.706 3.707a.501.501 0 00.705.003l7.712-7.712a.493.493 0 00-.006-.708l-.7-.7a.504.504 0 00-.714 0l-6.286 6.286a.506.506 0 01-.713 0l-2.288-2.287z"
											fill="currentColor"></path>
								</svg>
							</span>
							<span className='notification-list__switch-btn-svg'>
								<svg width="24" height="24" viewBox="0 0 24 24" role="presentation">
									<path d="M15.185 7.4l-3.184 3.185-3.186-3.186a.507.507 0 00-.712.003l-.7.701a.496.496 0 00-.004.712l3.185 3.184L7.4 15.185a.507.507 0 00.004.712l.7.7c.206.207.516.2.712.004l3.186-3.185 3.184 3.185a.507.507 0 00.712-.004l.701-.7a.496.496 0 00.003-.712l-3.186-3.186 3.186-3.184a.507.507 0 00-.003-.712l-.7-.7a.508.508 0 00-.36-.153.5.5 0 00-.353.15z" fill="currentColor" fillRule="evenodd"></path>
								</svg>
							</span>
						</div>
					</div>
				</div>
				<div className='notification-list__separator'></div>
				<div className={`notification-list__content${notifications.length === 0 ? ' empty' : ''}`} ref={notificationListRef}>
					{notifications.map((notification, index) => {
						if (index === notifications.length - 3) {
							//сохраняем ссылку на последний элемент через передачу ему ref
							return <NotificationItem
									key={notification.id}
									closeDropdown={() => closeDropdown()}
									notification={notification}
									ref={lastItem}
									isShowReadNotifications={isShowReadNotifications}
							/>;
						}

						return <NotificationItem
								key={notification.id}
								closeDropdown={() => closeDropdown()}
								notification={notification}
								isShowReadNotifications={isShowReadNotifications}
						/>
					})}
					{(isLoadingNotificationList || isLoadingFetchViewedNotificationList) &&
							<div className='notification-list__load-more'>
								<MyLoaderSpinner classes={['notification-list__load-more-svg']}/>
							</div>
					}
					{isShowReadNotifications && notifications.length === 0 && !isLoadingFetchViewedNotificationList &&
							<div className='notification-list__empty'>
								<svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 96 96">
									<path
											d="M71.3,74.06a1,1,0,0,1-1-1V17a3,3,0,0,0-3-3h-11a1,1,0,0,1,0-2h11a5,5,0,0,1,5,5V73.06A1,1,0,0,1,71.3,74.06Z"/>
									<path
											d="M61.33,86.51H18.74a5,5,0,0,1-5-5V17a5,5,0,0,1,5-5h11a1,1,0,0,1,0,2h-11a3,3,0,0,0-3,3V81.5a3,3,0,0,0,3,3H61.33a1,1,0,0,1,0,2Z"/>
									<path
											d="M71.3,94a11,11,0,1,1,11-11A11,11,0,0,1,71.3,94Zm0-19.94a9,9,0,1,0,9,9A9,9,0,0,0,71.3,74.06Z"/>
									<path d="M61.33,29.43H24.7a1,1,0,1,1,0-2H61.33a1,1,0,0,1,0,2Z"/>
									<path d="M61.33,37.34H24.7a1,1,0,0,1,0-2H61.33a1,1,0,0,1,0,2Z"/>
									<path d="M61.33,45.25H24.7a1,1,0,0,1,0-2H61.33a1,1,0,0,1,0,2Z"/>
									<path d="M61.33,53.16H24.7a1,1,0,0,1,0-2H61.33a1,1,0,0,1,0,2Z"/>
									<path d="M61.33,61.07H24.7a1,1,0,1,1,0-2H61.33a1,1,0,0,1,0,2Z"/>
									<path d="M61.33,69H24.7a1,1,0,0,1,0-2H61.33a1,1,0,0,1,0,2Z"/>
									<path
											d="M56.27,18.14H29.76a1,1,0,0,1-1-1v-8a1,1,0,0,1,1-1H56.27a1,1,0,0,1,1,1v8A1,1,0,0,1,56.27,18.14Zm-25.51-2H55.27v-6H30.76Z"/>
									<path
											d="M35.15,10.16a1,1,0,0,1-.95-1.33C35.68,4.68,39.14,2,43,2s7.31,2.67,8.8,6.81a1,1,0,0,1-1.88.67C48.74,6.15,46,4,43,4s-5.74,2.16-6.93,5.5A1,1,0,0,1,35.15,10.16Z"/>
									<path
											d="M69.87,86.9h0a1,1,0,0,1-.7-.3L66.3,83.74a1,1,0,0,1,0-1.42,1,1,0,0,1,1.41,0l2.16,2.16,5-5a1,1,0,1,1,1.41,1.41L70.58,86.6A1,1,0,0,1,69.87,86.9Z"/>
								</svg>
								<span>Нет непрочитанных уведомлений</span>
							</div>
					}
				</div>
			</div>
	);
};

export default NotificationList;