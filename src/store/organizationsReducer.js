const defaultState = {
    organizations: []
}

const SET_ORGANIZATIONS = "SET_ORGANIZATIONS"


export const organizationsReducer = (state = defaultState, action) => {
    switch (action.type) {
        case SET_ORGANIZATIONS:
            return {...state, organizations: [...state.organizations, ...action.payload]}

        default:
            return state
    }
}

export const setOrganizationsAction = (payload) => ({type: SET_ORGANIZATIONS, payload})
