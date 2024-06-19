import React, {useEffect, useState} from 'react';
import "./TaskMain.scss"
import {Helmet} from "react-helmet";
import SelectTaskStage from "../../SelectTaskStage/SelectTaskStage";
import {useFetching} from "../../../hooks/useFetching";
import PostService from "../../../API/PostService";
import {useDispatch} from "react-redux";
import MyLoaderSpinner from "../../UI/MyLoaderSpinner/MyLoaderSpinner";
import TaskDescription from "../TaskDescription/TaskDescription";
import TaskSidebar from "../TaskSidebar/TaskSidebar";
import {
    changeCurrentProjectTaskAction,
} from "../../../store/currentProject";
import {useParams} from "react-router-dom";
import ProjectTaskHeader from "../../Project/ProjectTaskHeader/ProjectTaskHeader";
import TaskComment from "../TaskComment/TaskComment";
import { TaskCheckLists } from '../TaskCheckLists/TaskCheckLists';

const TaskMain = ({task, projectColumns, scrollToAction, projectTasks, columnTasks, isFirstLoadTasks}) => {
    const dispatch = useDispatch()
    const params = useParams();

    const [openSelectStage, setOpenSelectStage] = useState(false);
    const [nameValue, setNameValue] = useState(' ');
    const [isFirstLoad, setIsFirstLoad] = useState(true)
    const [isLoadingGetParsedownDesc, setIsLoadingGetParsedownDesc] = useState(false)
    const [isLoadingTaskCommentsTask, setIsLoadingTaskCommentsTask] = useState(false)
    const [isLoadingAddTaskCommentTask, setIsLoadingAddTaskCommentTask] = useState(false)

    const currentStageName = projectColumns.find(column => column.stageId === Number(task.stage)).stageName

    const [fetchChangeTaskName] = useFetching(async (taskId, value) => {
        await PostService.changeTaskName(taskId, value)
    })

    const [fetchMarkTaskAsViewed] = useFetching(async (taskId) => {
        await PostService.markTaskAsViewed(taskId)
    })

    const [fetchGetCurrentTask, isLoadingFetchGetCurrentTask] = useFetching(async (taskId) => {
        const response = await PostService.getCurrentTask(taskId)
        if (response.data.success && response.data.result !== false) {
            dispatch(changeCurrentProjectTaskAction(response.data.result))
        }
    })

    const closeSelectTaskStageHandler = (e) => {
        e.stopPropagation();
        setOpenSelectStage(false)
    }

    useEffect(() => {
        if(isFirstLoadTasks) {
            fetchGetCurrentTask(task.id)
        }
        setIsFirstLoad(false);
        return () =>  document.removeEventListener('click', closeTaskWithoutName)
    }, []);

    useEffect(() => {
        if (!isFirstLoad) {
            document.addEventListener('click', closeTaskWithoutName)
        }
        return () =>  document.removeEventListener('click', closeTaskWithoutName)

    }, [nameValue]);

    useEffect(() => {
        if (task.new) {
            fetchMarkTaskAsViewed(task.id)
            dispatch(changeCurrentProjectTaskAction({id: task.id, new: false}))
        }

        setNameValue(task.name)
    }, [task]);


    const closeTaskWithoutName = (e) => {
        if (!e.target.closest('.modal') || e.target.closest('.modal__close-holder')) {
            let value = nameValue;
            if(nameValue === '') {
                value = `Задача без названия №${params.taskId}`
            }
            dispatch(changeCurrentProjectTaskAction({id: task.id, name: value}))
            fetchChangeTaskName(task.id, value)
        }
    }

    const onBlurNameHandler = (e) => {
        let value = e.target.value

        if (value === '') {
            value = 'Задача без названия №' + task.id

        }

        fetchChangeTaskName(task.id, value)
    }

    const changeNameHolder = (value) => {
        setNameValue(value)
        dispatch(changeCurrentProjectTaskAction({id: task.id, name: value}))
    }


    const isLoadingGetParsedownDescHolder = (value) => {
        setIsLoadingGetParsedownDesc(value)
    }

    return (
        <div className={isLoadingFetchGetCurrentTask ? 'task task-wait' : 'task'}>
            <Helmet
                title={nameValue}
            />
            <div className='task__top'>
                <ProjectTaskHeader
                    isLoadingFetchGetCurrentTask={isLoadingFetchGetCurrentTask}
                    nameValue={nameValue}
                    onBlurNameHandler={onBlurNameHandler}
                    changeNameHolder={changeNameHolder}
                />
                <div className="task__top-select-stage">
                    <div className="task__top-select-stage-inline">
                        В колонке <span onClick={() => setOpenSelectStage(!openSelectStage)}>
                            {currentStageName}
                        </span>
                    </div>
                    {openSelectStage &&
                        <SelectTaskStage
                            closeSelectTaskStage={closeSelectTaskStageHandler}
                            projectColumns={projectColumns}
                            columnTasks={columnTasks}
                            currentStage={task.stage}
                            projectTasks={projectTasks}
                            classes={["task__top-select-stage-holder"]}
                        />
                    }
                </div>
            </div>
            <div className="task__main">
                <div className="task-content">
                    <div className='task-content__item task-content__description'>
                        <div className='task-content__description-title'>
                            <h3>Описание</h3>
                            {isLoadingGetParsedownDesc &&
                                <MyLoaderSpinner/>
                            }
                        </div>
                        <TaskDescription
                            task={task}
                            isLoadingGetParsedownDesc={isLoadingGetParsedownDescHolder}
                        />
                        {
                            task.check_lists && Array.isArray(task.check_lists) &&
                            <TaskCheckLists task={task} />
                        }
                    </div>
                    <div className="task-content__item task-content__comments">
                        <div className="task-content__comments-header">
                            <h3>Комментарии</h3>
                            {(isLoadingTaskCommentsTask || isLoadingAddTaskCommentTask) &&
                                <MyLoaderSpinner/>
                            }
                        </div>
                        <TaskComment
                            task={task}
                            scrollToAction={scrollToAction}
                            isLoadingAddTaskCommentTask={setIsLoadingTaskCommentsTask}
                            isLoadingTaskCommentsTask={setIsLoadingAddTaskCommentTask}
                        />
                    </div>
                </div>
                <TaskSidebar
                    task={task}
                    projectColumns={projectColumns}
                    columnTasks={columnTasks}
                    projectTasks={projectTasks}
                />
            </div>
        </div>
    );
};

export default TaskMain;
