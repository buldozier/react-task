const defaultState = {
    currentUser: {},
    isShowReadNotifications: false,
}

const SET_CURRENT_USER = "SET_CURRENT_USER"
const GET_CURRENT_USER = "GET_CURRENT_USER"
const SET_IS_SHOW_READ_NOTIFICATIONS = "SET_IS_SHOW_READ_NOTIFICATIONS"

export const currentUserReducer = (state = defaultState, action) => {
    switch (action.type) {
        case SET_CURRENT_USER:
            return {...state, currentUser: {...state.currentUser, ...action.payload}}

        case GET_CURRENT_USER:
            return state.currentUser

        case SET_IS_SHOW_READ_NOTIFICATIONS:
            return {...state, isShowReadNotifications: action.payload}

        default:
            return state
    }
}

export const setCurrentUserAction = (payload) => ({type: SET_CURRENT_USER, payload})
export const getCurrentUserAction = () => ({type: GET_CURRENT_USER})
export const setIsShowReadNotificationsAction = (payload) => ({type: SET_IS_SHOW_READ_NOTIFICATIONS, payload})
