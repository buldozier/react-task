import {mainUrlRequest} from "../constants/constants";
import axios from "axios";

export default class PostService {
    static async getUserInfo() {
        return await axios.get(mainUrlRequest, {
            params: {
                action: "getCurrentUser",
            }
        })
    }

    static async logout() {
        return await axios.get(mainUrlRequest + 'action=logout')
    }

    static async getUserProjects() {
        return await axios.get(mainUrlRequest, {
            params: {
                action: "getUserProjects",
            }
        })
    }

    static async getUserProjectsMarked() {
        return await axios.get(mainUrlRequest, {
            params: {
                action: "getUserProjectsMarked",
            }
        })
    }

    static async getAvailableProjects() {
        return await axios.get(mainUrlRequest, {
            params: {
                action: "getAvailableProjects",
            }
        })
    }

    static async getProjectTasks(id) {
        return await axios.get(mainUrlRequest, {
            params: {
                action: "getProjectTasks",
                id,
            }
        })
    }

    static async getOrganization(id) {
        return await axios.get(mainUrlRequest, {
            params: {
                action: "getOrganization",
                id,
            }
        })
    }

    static async addProject(inputValue) {
        return await axios.post(mainUrlRequest + '&action=add', {
            object: 'project',
            data: {
                name: inputValue,
            },
        })
    }

    static async getCurrentProjectInfo(id) {
        return await axios.get(mainUrlRequest, {
            params: {
                action: "get",
                object: "project",
                id,
            }
        })
    }

    static async getCurrentProjectTasks(id) {
        return await axios.get(mainUrlRequest, {
            params: {
                action: "getProjectTasks",
                id,
            }
        })
    }

    static async createNewTask(projectId, taskName, description, deadline, timeSpent, newSelectedTags) {
        return await axios.post(mainUrlRequest + "&action=add", {
            object: 'task',
            data: {
                name: taskName,
                stage: 1,
                project: projectId,
                description: description,
                date_deadline: deadline,
                time_spent: timeSpent,
                tags: newSelectedTags,
            },
        })
    }

    static async getCurrentTask(taskId) {
        return await axios.post(mainUrlRequest + "&action=get", {
            object: 'task',
            id: taskId,
        })
    }

    static async moveTask(taskId, newSort, newStage) {
        return await axios.post(mainUrlRequest + '&action=update', {
            object: 'task',
            id: taskId,
            data: {
                sort: newSort,
                stage: newStage,
            }
        })
    }

    static async positionTask(taskId, newSort, newStage, prevStage) {
        return await axios.post(mainUrlRequest + '&action=positionTask', {
            id: taskId,
            pos: newSort,
            stage: newStage,
            prevStage: prevStage,
            data: {}
        })
    }

    static async changeTaskDeadline(taskId, value) {
        return await axios.post(mainUrlRequest + '&action=update', {
            object: 'task',
            id: taskId,
            data: {
                date_deadline: value,
            }
        })
    }

    static async changeTaskDeadlineState(taskId, value) {
        return await axios.post(mainUrlRequest + '&action=update', {
            object: 'task',
            id: taskId,
            data: {
                date_deadline_state: value,
            }
        })
    }

    static async changeTimeSpent(taskId, value) {
        return await axios.post(mainUrlRequest + '&action=update', {
            object: 'task',
            id: taskId,
            data: {
                time_spent: value,
            }
        })
    }

    static async getUsers(ids) {
        return await axios.post(mainUrlRequest + '&action=getUser', {
            id: ids,
        })
    }

    static async changeTaskDescription(taskId, value) {
        return await axios.post(mainUrlRequest + '&action=update', {
            object: 'task',
            id: taskId,
            data: {
                description: value,
            }
        })
    }

    static async changeTaskName(taskId, value) {
        return await axios.post(mainUrlRequest + '&action=update', {
            object: 'task',
            id: taskId,
            data: {
                name: value,
            }
        })
    }

    static async getTaskComments(id) {
        return await axios.post(mainUrlRequest + '&action=getTaskComments', {
            id,
        })
    }

    static async addTaskComment(id, value) {
        return await axios.post(mainUrlRequest + '&action=add', {
            object: 'comment',
            data: {
                text: value,
                task: id,
            }
        })
    }

    static async updateTaskComment(id, value) {
        return await axios.post(mainUrlRequest + '&action=update', {
            object: 'comment',
            id,
            data: {
                text: value,
            }
        })
    }

    static async getTaskComment(id) {
        return await axios.post(mainUrlRequest + '&action=get', {
            object: 'comment',
            id,
        })
    }

    static async markTaskAsViewed(id) {
        return await axios.post(mainUrlRequest + '&action=markTaskAsViewed', {
            id,
        })
    }

    static async markCommentAsViewed(ids) {
        return await axios.post(mainUrlRequest + '&action=markCommentAsViewed', {
            id: ids,
        })
    }

    static async markChangeStageAsViewed(id) {
        return await axios.post(mainUrlRequest + '&action=markChangeStageAsViewed', {
            id: id,
        })
    }

    static async searchUsers(value) {
        return await axios.get(mainUrlRequest, {
            params: {
                action: "searchUsers",
                q: value,
            }
        })
    }

    static async addProjectUsers(projectId, addArr) {
        return await axios.post(mainUrlRequest + '&action=addProjectUser', {
            id: projectId,
            user: addArr,
        })
    }

    static async removeProjectUsers(projectId, deleteArr) {
        return await axios.post(mainUrlRequest + '&action=removeProjectUser', {
            id: projectId,
            user: deleteArr,
        })
    }

    static async getNotifications(limit, offset, id, dateFilter) {
        return await axios.get(mainUrlRequest, {
            params: {
                action: "getNotifications",
                limit: limit,
                offset: offset,
                id: id,
                dateFilter: dateFilter,
            }
        })
    }

    static async getViewedNotifications(limit, offset, id, dateFilter) {
        return await axios.get(mainUrlRequest, {
            params: {
                action: "getNotifications",
                limit: limit,
                offset: offset,
                id: id,
                viewed: '0',
                dateFilter: dateFilter,
            }
        })
    }

    static async updateTaskTags(taskId, value) {
        return await axios.post(mainUrlRequest + '&action=update', {
            object: 'task',
            id: taskId,
            data: {
                tags: value,
            }
        })
    }

    static async updateTag(tagId, value) {
        return await axios.post(mainUrlRequest + '&action=update', {
            object: 'tags',
            id: tagId,
            data: {
                name: value,
            }
        })
    }

    static async addTag(name, projectId) {
        return await axios.post(mainUrlRequest + '&action=add', {
            object: 'tags',
            data: {
                name: name,
                project: projectId,
            }
        })
    }

    static async getParsedownText(text) {
        return await axios.get(mainUrlRequest, {
            params: {
                action: "parsedownText",
                text: text,
            }
        })
    }

    static async updateCheckList(listId, data) {
        return await axios.post(mainUrlRequest + '&action=updateCheckList', {
            id: listId,
            data: data,
        })
    }
}
