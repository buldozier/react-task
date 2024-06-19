const defaultState = {
    userProjects: [],
    userProjectsMarkedList: {},
}

const SET_USER_PROJECTS = "SET_USER_PROJECTS"
const SET_USER_PROJECTS_MARKED_LIST = "SET_USER_PROJECTS_MARKED_LIST"


export const userProjectsReducer = (state = defaultState, action) => {
    switch (action.type) {
        case SET_USER_PROJECTS:
            return {...state, userProjects: [...action.payload]}

        case SET_USER_PROJECTS_MARKED_LIST:
            return {...state, userProjectsMarkedList: action.payload}

        default:
            return state
    }
}

export const setUserProjectsAction = (payload) => ({type: SET_USER_PROJECTS, payload})

export const setUserProjectsMarkedListAction = (payload) => ({type: SET_USER_PROJECTS_MARKED_LIST, payload})
