const defaultState = {
    currentProjectInfo: {},
    currentProjectTasks: [],
    currentDraggableTask: {},
    currentDraggableColumn: null,
    currentDraggableTaskHeight: 0,
    currentUsers: [],
}

export const currentProjectReducer = (state = defaultState, action) => {
    switch (action.type) {
        case "SET_CURRENT_PROJECT_INFO":
            return {...state, currentProjectInfo: {...action.payload}}

        case "SET_CURRENT_PROJECT_TASKS":
            return {...state, currentProjectTasks: [...action.payload]}

        case "CHANGE_CURRENT_PROJECT_TASK":
            return {...state, currentProjectTasks: state.currentProjectTasks.map((task) => {
                if(task.id === action.payload.id) {

                    if(action.payload.name) {
                        task = {...task, name: action.payload.name}
                    }

                    if(action.payload.description) {
                        task = {...task, description: action.payload.description, description_html: action.payload.description_html}
                    }

                    if(action.payload.date_deadline_state) {
                        task = {...task, date_deadline_state: action.payload.date_deadline_state}
                    }

                    if(action.payload.setDeadline) {
                        task = {...task, date_deadline: action.payload.date_deadline, date_deadline_string: action.payload.date_deadline_string}
                    }

                    if(action.payload.new === false) {
                        task = {...task, new: false}
                    }

                    if(action.payload.has_new_comments === false) {
                        task = {...task, has_new_comments: false}
                    }
                }

                return task
            })}

        case "SET_CURRENT_DRAGGABLE_TASK":
            return {...state, currentDraggableTask: {...action.payload}}

        case "SET_CURRENT_DRAGGABLE_COLUMN":
            return {...state, currentDraggableColumn: action.payload}

        case "SET_CURRENT_DRAGGABLE_TASK_HEIGHT":
            return {...state, currentDraggableTaskHeight: action.payload}

        case "SET_CURRENT_USERS":
            return {...state, currentUsers: [...action.payload]}

        default:
            return state
    }
}

export const setCurrentProjectInfoAction = (payload) => ({type: "SET_CURRENT_PROJECT_INFO", payload})

export const setCurrentProjectTasksAction = (payload) => ({type: "SET_CURRENT_PROJECT_TASKS", payload})

export const changeCurrentProjectTaskAction = (payload) => ({type: "CHANGE_CURRENT_PROJECT_TASK", payload})

export const setCurrentDraggableTaskAction = (payload) => ({type: "SET_CURRENT_DRAGGABLE_TASK", payload})

export const setCurrentDraggableColumnAction = (payload) => ({type: "SET_CURRENT_DRAGGABLE_COLUMN", payload})

export const setCurrentDraggableTaskHeightAction = (payload) => ({type: "SET_CURRENT_DRAGGABLE_TASK_HEIGHT", payload})

export const setCurrentUsersAction = (payload) => ({type: "SET_CURRENT_USERS", payload})
