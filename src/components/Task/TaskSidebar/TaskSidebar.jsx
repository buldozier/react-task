import React, {useEffect, useRef, useState} from 'react';
import "./TaskSidebar.scss"
import MyButton from "../../UI/MyButton/MyButton";
import SelectTaskStage from "../../SelectTaskStage/SelectTaskStage";
import Person from "../../Person/Person";
import Skeleton from "react-loading-skeleton";
import {getDateString} from "../../../helpers/helpers";
import {useFetching} from "../../../hooks/useFetching";
import PostService from "../../../API/PostService";
import {useDispatch, useSelector} from "react-redux";
import 'react-calendar/dist/Calendar.css'
import MyDatePicker from "../../UI/MyDatePicker/MyDatePicker";
import MyCustomCheckbox from "../../UI/MyCustomCheckbox/MyCustomCheckbox";
import {changeCurrentProjectTaskAction} from "../../../store/currentProject";
import {copyURL} from "../../../helpers/helpers";
import { TaskTagsEdit } from '../TaskTags/TaskTags';

const TaskSidebar = (
    {   task,
        projectColumns,
        columnTasks,
        projectTasks,
        setNewDeadline,
        setNewTimeSpentHours,
        setNewTimeSpentMinutes,
        newSelectedTags,
        setNewSelectedTags,
    }) => {

    const dispatch = useDispatch()

    const taskCopy = useRef()

    const usersList = useSelector(state => state.currentProject.currentUsers)

    const [openSelectStageSidebar, setOpenSelectStageSidebar] = useState(false);
    const [taskCreator, setTaskCreator] = useState({})
    const [isSetTaskCreator, setIsSetTaskCreator] = useState(false)
    const [deadline, setDeadline] = useState('')
    const [deadlineString, setDeadlineString] = useState('')
    const [colorDeadline, setColorDeadline] = useState('')
    const [deadlineText, setDeadlineText] = useState('')
    const [deadlineState, setDeadlineState] = useState(null)
    const [timeSpentHours, setTimeSpentHours] = React.useState("00")
    const [timeSpentMinutes, setTimeSpentMinutes] = React.useState("00")
    const [isOpenCalendar, setIsOpenCalendar] = useState(false)
    const [isOpenTags, setIsOpenTags] = useState(false)

    const [fetchChangeTaskDeadline] = useFetching(async (taskId, value) => {
        await PostService.changeTaskDeadline(taskId, value)
    })

    const [fetchChangeTaskDeadlineState] = useFetching(async (taskId, value) => {
        await PostService.changeTaskDeadlineState(taskId, value)
    })

    const [fetchChangeTimeSpent] = useFetching(async (taskId, value) => {
        await PostService.changeTimeSpent(taskId, value)
    })

    const [fetchTaskCreator, isLoadingTaskCreator] = useFetching(async (userId) => {
        const response = await PostService.getUsers(userId)
        if (response.data.success && response.data.result !== false && response.data.result.length > 0) {
            setTaskCreator(response.data.result)
        }
        setIsSetTaskCreator(true)
    })

    useEffect(() => {
        if(task) {
            if(!deadline && deadline !== null) {
                setDeadline(task.date_deadline ? new Date(task.date_deadline * 1000) : '')
            }

            if(!deadlineString && deadlineString !== null) {
                setDeadlineString(task.date_deadline_string ? task.date_deadline_string : '')
            }

            if (task.time_spent && task.time_spent !== "0") {
                const spentHours = Math.floor(task.time_spent / 3600);
                setTimeSpentHours(spentHours < 10 ? '0' + spentHours : spentHours)
            } else {
                setTimeSpentHours('00');
            }

            if (task.time_spent && task.time_spent !== "0") {
                const spentMinutes = task.time_spent % 3600 / 60;
                setTimeSpentMinutes(spentMinutes < 10 ? '0' + spentMinutes : spentMinutes)
            } else {
                setTimeSpentMinutes('00');
            }

            if (usersList.find(user => user.id === task.user)) {
                setTaskCreator(usersList.filter(user => user.id === task.user))
                setIsSetTaskCreator(true)
            } else {
                fetchTaskCreator([task.user])
            }

            if(task.date_deadline_state && task.date_deadline_state !== '0' && deadlineState === null) {
                setDeadlineState(true)
            }
        }

    }, [task]);

    useEffect(() => {
        if(task) {
            if(deadlineState && deadlineState !== '0') {
                setDeadlineText('Выполнен')
                setColorDeadline(' green')
            } else {
                setDeadlineText('')
                setColorDeadline('')
            }
        }
    }, [deadlineState]);

    const closeSelectTaskStageHandler = (e) => {
        e.stopPropagation();
        setOpenSelectStageSidebar(false)
    }

    const changeDeadline = (valueDate) => {
        let value = '';

        if(valueDate) {
            value = valueDate.toLocaleDateString();
        }
        setDeadline(valueDate);
        if(setNewDeadline) {
            setNewDeadline(valueDate)
        }
        setDeadlineString(value ? value : '')
        setIsOpenCalendar(false)

        if(task) {
            fetchChangeTaskDeadline(task.id, value)
            dispatch(changeCurrentProjectTaskAction({id: task.id, setDeadline: true, date_deadline: new Date(valueDate).getTime()/1000, date_deadline_string: value}))
        }
    }

    const changeTimeSpentHandler = (timeSpentHours, timeSpentMinutes) => {
        setTimeSpentHours(timeSpentHours);
        setTimeSpentMinutes(timeSpentMinutes);

        if(setNewTimeSpentHours) {
            setNewTimeSpentHours(timeSpentHours)
        }

        if(setNewTimeSpentMinutes) {
            setNewTimeSpentMinutes(timeSpentMinutes)
        }

        if(task) {
            let value = timeSpentHours * 3600 + timeSpentMinutes * 60;
            fetchChangeTimeSpent(task.id, value)
        }
    }

    const onChangeDeadlineStatus = (state) => {
        setDeadlineState(state)
        if(task) {
            fetchChangeTaskDeadlineState(task.id, state ? '1' : '0')
            dispatch(changeCurrentProjectTaskAction({id: task.id, date_deadline_state: state ? '1' : '0'}))
        }
    }

    const onDeleteDateHandler = () => {
        onChangeDeadlineStatus(false)
        changeDeadline(null)
    }

    const setSelectedTagsNewTaskHolder = (tags) => {
        if(setNewSelectedTags) {
            setNewSelectedTags(tags)
        }
    }

    return (
        <div className="task-sidebar">
            <div className='task-sidebar__block'>
                <div className="task-sidebar__block-item task-sidebar__select-stage">
                    <h4>Действия</h4>
                    {task &&
                        <>
                            <MyButton classes={["dark", "moveImg"]}
                                      onClick={() => setOpenSelectStageSidebar(!openSelectStageSidebar)}>
                                Перемещение
                            </MyButton>
                            {openSelectStageSidebar &&
                                <SelectTaskStage
                                    closeSelectTaskStage={closeSelectTaskStageHandler}
                                    projectColumns={projectColumns}
                                    columnTasks={columnTasks}
                                    currentStage={task.stage}
                                    projectTasks={projectTasks}
                                    classes={["task-sidebar__select-stage-holder"]}
                                />
                            }
                        </>
                    }
                </div>
                {task &&
                    <div className='task-sidebar__block-item task-sidebar__copy-url' ref={taskCopy}
                         onClick={() => copyURL(taskCopy)}>
                        <MyButton classes={["dark", "copyImg"]}>
                            Ссылка
                        </MyButton>
                    </div>
                }
                <div className='task-sidebar__block-item'>
                    <MyButton
                        classes={["dark", "setDeadline"]}
                        onClick={() => setIsOpenCalendar(!isOpenCalendar)}
                    >
                        Дедлайн
                    </MyButton>
                    {isOpenCalendar &&
                        <MyDatePicker
                            title={'Установить дедлайн'}
                            date={deadline}
                            onClickDay={changeDeadline}
                            onCloseHandler={() => setIsOpenCalendar(false)}
                            onDeleteDate={onDeleteDateHandler}
                        />
                    }
                </div>

                <div className='task-sidebar__block-item'>
                    <MyButton
                        classes={["dark", "tags"]}
                        onClick={() => setIsOpenTags(!isOpenTags)}
                    >
                        Теги
                    </MyButton>
                    {isOpenTags &&
                        <TaskTagsEdit
                            task={task ?? {}}
                            closeDropdown={() => setIsOpenTags(false)}
                            newSelectedTags={newSelectedTags ? [...newSelectedTags] : newSelectedTags}
                            setSelectedTagsNewTask={setSelectedTagsNewTaskHolder}
                        />

                    }
                </div>
            </div>
            {task && taskCreator.length > 0 && !isLoadingTaskCreator && isSetTaskCreator
                ? <div className="task-sidebar__item task-setter">
                    <div className='task-setter-text'>Постановщик</div>
                    <Person person={taskCreator[0]} size={'s'}/>
                </div>
                : (task && !isSetTaskCreator) &&
                <Skeleton
                    height={43}
                    style={{marginBottom: "15px"}}
                    baseColor={"rgba(9, 30, 66, 0.0588235294)"}
                    highlightColor={"rgba(9, 30, 66, 0.1411764706)"}
                    borderRadius={10}
                />
            }
            {task && task.date_create &&
                <div className="task-sidebar__item">
                    <div className='task-sidebar__item-text'>Дата создания</div>
                    <span>{getDateString(task.date_create, task.date_create_string)}</span>
                </div>
            }
            {task && task.date_create &&
                <div className="task-sidebar__item">
                    <div className='task-sidebar__item-text'>Дата изменения</div>
                    <span>
                        {task.latest_alteration_string
                            ? getDateString(task.latest_alteration * 1000, task.latest_alteration_string)
                            : getDateString(task.date_create * 1000, task.date_create_string)
                        }
                    </span>
                </div>
            }
            {deadline &&
                <div className="task-sidebar__item">
                    <div className='task-sidebar__item-text task-deadline-text'>Крайний срок</div>
                    <div className='task-sidebar__item-content task-deadline'>
                        {/*<MyCustomCheckbox defaultState={deadlineState} onChange={onChangeDeadlineStatus}/>*/}
                        <div>{getDateString(new Date(deadline).getTime(), deadlineString, true)}</div>
                        <div className={'task-deadline__status' + colorDeadline}>{deadlineText}</div>
                    </div>
                </div>
            }

            <div className="task-sidebar__item task-timecost">
                <div className='task-sidebar__item-text task-timecost-text'>Трудозатраты</div>
                <div className="task-timecost__inputs">
                    <div className="task-timecost__hours">
                        <input
                            type='text'
                            value={timeSpentHours}
                            onChange={e => changeTimeSpentHandler(e.target.value, timeSpentMinutes)}
                        />
                    </div>
                    <div className='task-timecost__hours-text-hours'>час.</div>
                    <div className="task-timecost__minutes">
                        <input
                            type='text'
                            value={timeSpentMinutes}
                            onChange={e => changeTimeSpentHandler(timeSpentHours, e.target.value)}
                        />
                    </div>
                    <div className='task-timecost__hours-text-minutes'>мин.</div>
                </div>
            </div>
        </div>
    );
};

export default TaskSidebar;
