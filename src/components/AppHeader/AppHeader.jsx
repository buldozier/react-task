import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {CreateTaskLogo} from "../../helpers/helpers";
import {setCurrentUserAction} from "../../store/currentUserReducer";
import {useFetching} from "../../hooks/useFetching";
import PostService from "../../API/PostService";
import "./AppHeader.scss"
import UserProjects from "../User/UserProjects/UserProjects";
import CreateProject from "../CreateProject/CreateProject";
import UserProfile from "../User/UserProfile/UserProfile";
import {setOrganizationsAction} from "../../store/organizationsReducer";
import NotificationList from "../Notifications/NotificationList/NotificationList";
import {
    setNotificationsAction,
    setViewedNotificationsAction, updateNotificationsAction, updateViewedNotificationsAction
} from "../../store/notificationReducer";
import {devMode} from "../../constants/constants";

const AppHeader = () => {
    const dispatch = useDispatch()
    const currentUser = useSelector(state => state.currentUser.currentUser)
    const viewedNotificationList = useSelector(state => state.notifications.viewedNotifications)

    const [isNotificationListOpen, setIsNotificationListOpen] = useState(false)
    const [showNotViewedNotifications, setShowNotViewedNotifications] = useState(false)

    const [fetchCurrentUser] = useFetching(async () => {
        const response = await PostService.getUserInfo()
        if (response.data.success && response.data.result !== false) {
            dispatch(setCurrentUserAction(response.data.result))
        }
    })

    const [fetchOrganizationsList] = useFetching(async () => {
        const response = await PostService.getOrganization()
        if (response.data.success && response.data.result !== false) {
            dispatch(setOrganizationsAction(response.data.result))
        }
    })

    const [fetchNotificationList] = useFetching(async (limit, offset, id, dateFilter) => {
        const response = await PostService.getNotifications(limit, offset, id, dateFilter)
        if (response.data.success && response.data.result !== false) {
            if(!dateFilter) {
                dispatch(setNotificationsAction(response.data.result))
            } else {
                dispatch(updateNotificationsAction(response.data.result))
            }
        }
    })

    const [fetchViewedNotificationList] = useFetching(async (limit, offset, id, dateFilter) => {
        const response = await PostService.getViewedNotifications(limit, offset, id, dateFilter)
        if (response.data.success && response.data.result !== false) {
            if(!dateFilter) {
                dispatch(setViewedNotificationsAction(response.data.result))
            } else {
                dispatch(updateViewedNotificationsAction(response.data.result))
            }
        }
    })

    useEffect(() => {
        fetchCurrentUser()
        fetchOrganizationsList();
    }, []);

    useEffect(() => {
        if(viewedNotificationList.length > 0) {
            const res = viewedNotificationList.reduce((acc, item) => {
                if(item && item.viewed === '0') {
                    acc++
                }

                return acc
            }, 0)

            if(res) {
                setShowNotViewedNotifications(true)
            } else {
                setShowNotViewedNotifications(false)
            }
        }
    }, [viewedNotificationList]);

    useEffect(() => {
        if(currentUser.id > 0) {
            fetchNotificationList(25, 0, currentUser.id);
            fetchViewedNotificationList(25, 0, currentUser.id);

            setInterval(() => {
                fetchNotificationList(25, 0, currentUser.id, true);
                fetchViewedNotificationList(25, 0, currentUser.id, true);
            }, 60000) // Раз в минуту запрашиваем новые уведомления
        }
    }, [currentUser]);

    return (
        <div className="header">
            <div className="l-wrapper">
                <div className="header-holder">
                    <div className="header-holder__left">
                        <CreateTaskLogo/>
                        <div className='header-holder__selector-and-new'>
                            <UserProjects/>
                            {currentUser.is_staff &&
                                <CreateProject/>
                            }
                        </div>
                    </div>
                    <div className="header-holder__right">
                        <div className="header-holder__links">
                            <div className="header-holder__link">
                                <div
                                    className="header-holder__link-btn notifications"
                                    onClick={() => setIsNotificationListOpen(!isNotificationListOpen)}
                                >
                                    {showNotViewedNotifications &&
                                        <div
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setIsNotificationListOpen(!isNotificationListOpen)
                                            }}
                                             className='notifications__not-viewed'
                                             style={{
                                                 left: viewedNotificationList.length < 10 ? '60%' : viewedNotificationList.length < 100 ? '50%' : '35%',
                                             }}
                                        >
                                            <div
                                                style={{
                                                    fontSize: viewedNotificationList.length > 99 ? '8px' : '10px',
                                                    lineHeight: viewedNotificationList.length > 99 ? '8px' : '10px',
                                                }}
                                            >
                                                {viewedNotificationList.length < 100 ? viewedNotificationList.length : "99+"}
                                            </div>
                                        </div>
                                    }
                                </div>
                                {isNotificationListOpen &&
                                    <NotificationList
                                        closeDropdown={() => setIsNotificationListOpen(false)}
                                    />
                                }
                            </div>
                            <div className="header-holder__link">
                                <div className="header-holder__link-btn help"></div>
                            </div>
                            <div className="header-holder__link">
                                <div className="header-holder__link-btn theme"></div>
                            </div>
                        </div>
                        <div className='header-holder__profile'>
                            <UserProfile />
                        </div>
                    </div>

                </div>
            </div>
        </div>

    );
};

export default AppHeader;