import {combineReducers, createStore, applyMiddleware} from "redux";
import {composeWithDevTools} from "@redux-devtools/extension";
import {thunk} from "redux-thunk";
import {currentUserReducer} from "./currentUserReducer";
import {userProjectsReducer} from "./userProjectReducer";
import {availableProjectsReducer} from "./availableProjectsReducer";
import {organizationsReducer} from "./organizationsReducer";
import {currentProjectReducer} from "./currentProject";
import {notificationReducer} from "./notificationReducer";

const rootReducer = combineReducers({
    currentUser: currentUserReducer,
    userProjects: userProjectsReducer,
    availableProjects: availableProjectsReducer,
    organizations: organizationsReducer,
    currentProject: currentProjectReducer,
    notifications: notificationReducer,
})

export const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)))