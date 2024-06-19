import React, {useEffect, useState} from 'react';
import "./Project.scss"
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import {useFetching} from "../../hooks/useFetching";
import PostService from "../../API/PostService";
import {
    setCurrentProjectInfoAction,
    setCurrentProjectTasksAction,
} from "../../store/currentProject";
import ProjectColumn from "../../components/Project/ProjectColumn/ProjectColumn";
import Modal from "../../components/UI/Modal/Modal";
import TaskMain from "../../components/Task/TaskMain/TaskMain";
import {Helmet} from "react-helmet";
import ModalTaskLoader from "../../components/UI/ModalTaskLoader/ModalTaskLoader";
import ProjectInfo from "../../components/Project/ProjectInfo/ProjectInfo";

const projectColumns = [
    {stageId: 1, stageName: 'Обсуждение'},
    {stageId: 2, stageName: 'Взять в работу'},
    {stageId: 3, stageName: 'В работе'},
    {stageId: 4, stageName: 'Выполнено на ТС'},
    {stageId: 5, stageName: 'Выполнено на БС'},
    {stageId: 6, stageName: 'Отменено'},
];
const Project = () => {
    const params = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const projectTasks = useSelector(state => state.currentProject.currentProjectTasks)
    const projectInfo = useSelector(state => state.currentProject.currentProjectInfo)

    const [isFirstLoadTasks, setIsFirstLoadTasks] = useState(false)
    const [scrollToPos, setScrollToPos] = useState('');

    const currentTask = projectTasks.find(task => task.id === params.taskId)

    const [fetchCurrentProjectInfo] = useFetching(async (projectId) => {
        const response = await PostService.getCurrentProjectInfo(projectId)
        if (response.data.success && response.data.result !== false) {
            dispatch(setCurrentProjectInfoAction(response.data.result))
        }

        if(!response.data.success) {
            navigate('/')
        }
    })

    const [fetchCurrentProjectTasks] = useFetching(async (projectId) => {
        const response = await PostService.getCurrentProjectTasks(projectId)
        if (response.data.success && response.data.result !== false) {
            dispatch(setCurrentProjectTasksAction(response.data.result))
            setIsFirstLoadTasks(true)
        }
    })

    useEffect(() => {
        fetchCurrentProjectInfo(params.id)
        fetchCurrentProjectTasks(params.id)

        setIsFirstLoadTasks(false);

        return () => dispatch(setCurrentProjectTasksAction([]))
    }, [params.id]);

    const closeModalHandler = () => {
        setTimeout(() => {
            fetchCurrentProjectTasks(params.id)
        }, 200)

        setTimeout(() => {
            navigate(`/${params.id}/`, { replace: true });
        }, 100);
    }

    const scrollToHolder = () => {
        setScrollToPos(window.location.hash.slice(1))
        setTimeout(() => {
            setScrollToPos(0)
        }, 10)
    }


    return (
        <div className="project">
            <Helmet
                title={projectInfo.name}
            />
            <ProjectInfo/>
            <div className="project-content g-custom-scroll">
                {projectColumns && projectColumns.map(column =>
                    <ProjectColumn
                        key={column.stageId}
                        projectId={params.id}
                        columnId={column.stageId}
                        columnStage={column.stageName}
                        isFirstLoadTasks={isFirstLoadTasks}
                        columnTasks={projectTasks.filter(task => Number(task.stage) === column.stageId).sort((a, b) => a.sort - b.sort)}
                    />
                )}
            </div>
            {!!params.taskId && currentTask &&
                <Modal
                    scrollToPos={scrollToPos}
                    closeModalHandler={closeModalHandler}
                >
                    {projectTasks.length > 0 ?
                        <TaskMain
                            task={currentTask}
                            scrollToAction={scrollToHolder}
                            projectColumns={projectColumns}
                            columnTasks={projectTasks.filter(task => task.stage === currentTask.stage)}
                            projectTasks={projectTasks}
                            isFirstLoadTasks={isFirstLoadTasks}
                        />
                        : <ModalTaskLoader/>
                    }
                </Modal>
            }
        </div>
    );
};

export default Project;
