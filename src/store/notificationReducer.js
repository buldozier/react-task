const defaultState = {
	notifications: [],
	viewedNotifications: [],
}

const SET_NOTIFICATIONS = "SET_NOTIFICATIONS"
const SET_VIEWED_NOTIFICATIONS = "SET_VIEWED_NOTIFICATIONS"
const CHANGE_NOTIFICATION = 'CHANGE_NOTIFICATION'
const CHANGE_VIEWED_NOTIFICATION = 'CHANGE_VIEWED_NOTIFICATION'
const DELETE_VIEWED_NOTIFICATIONS = 'DELETE_VIEWED_NOTIFICATIONS'
const UPDATE_NOTIFICATIONS = "UPDATE_NOTIFICATIONS"
const UPDATE_VIEWED_NOTIFICATIONS = "UPDATE_VIEWED_NOTIFICATIONS"


export const notificationReducer = (state = defaultState, action) => {
	switch (action.type) {
		case SET_NOTIFICATIONS:
			return {...state, notifications: [...state.notifications, ...action.payload]}

		case CHANGE_NOTIFICATION:
			return {...state, notifications: state.notifications.map(notification => {

				if(notification && notification.id === action.payload.id) {
					notification = action.payload
				}

				return notification
			})}

		case SET_VIEWED_NOTIFICATIONS:
			return {...state, viewedNotifications: [...state.viewedNotifications, ...action.payload]}

		case CHANGE_VIEWED_NOTIFICATION:
			const newArrChangeViewed = [];
			state.viewedNotifications.forEach(notification => {
				if(notification.id === action.payload.data.id && !action.payload.delItem) {
					if(action.payload.delItem) {
						return false;
					}

					newArrChangeViewed.push(action.payload.data);
				} else {
					newArrChangeViewed.push(notification)
				}
			})

			return {...state, viewedNotifications: newArrChangeViewed}

		case DELETE_VIEWED_NOTIFICATIONS:
			const newArrDeleteViewed = [];
			state.viewedNotifications.forEach(notification => {
				if(notification.viewed === '0') {
					newArrDeleteViewed.push(notification)
				}
			})
			return {...state, viewedNotifications: newArrDeleteViewed}

		case UPDATE_NOTIFICATIONS:
			return {...state, notifications: [...action.payload, ...state.notifications]}

		case UPDATE_VIEWED_NOTIFICATIONS:
			return {...state, viewedNotifications: [...action.payload, ...state.viewedNotifications]}


		default:
			return state
	}
}

export const setNotificationsAction = (payload) => ({type: SET_NOTIFICATIONS, payload})

export const changeNotificationAction = (payload) => ({type: CHANGE_NOTIFICATION, payload})

export const setViewedNotificationsAction = (payload) => ({type: SET_VIEWED_NOTIFICATIONS, payload})

export const changeViewedNotificationAction = (payload) => ({type: CHANGE_VIEWED_NOTIFICATION, payload})

export const deleteViewedNotificationsAction = (payload) => ({type: DELETE_VIEWED_NOTIFICATIONS, payload})

export const updateNotificationsAction = (payload) => ({type: UPDATE_NOTIFICATIONS, payload})

export const updateViewedNotificationsAction = (payload) => ({type: UPDATE_VIEWED_NOTIFICATIONS, payload})

