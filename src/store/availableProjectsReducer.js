const defaultState = {
    availableProjects: []
}

const SET_AVAILABLE_PROJECTS = "SET_AVAILABLE_PROJECTS"


export const availableProjectsReducer = (state = defaultState, action) => {
    switch (action.type) {
        case SET_AVAILABLE_PROJECTS:
            return {...state, availableProjects: [...state.availableProjects, ...action.payload]}

        default:
            return state
    }
}

export const setAvailableProjectsAction = (payload) => ({type: SET_AVAILABLE_PROJECTS, payload})
