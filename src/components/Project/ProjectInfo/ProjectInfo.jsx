import React, {useEffect, useState} from 'react';
import './ProjectInfo.scss'
import {useDispatch, useSelector} from "react-redux";
import {setCurrentProjectInfoAction} from "../../../store/currentProject";
import {mainUrl} from "../../../constants/constants";
import Skeleton from "react-loading-skeleton";
import ProjectTeam from "../ProjectTeam/ProjectTeam";
import ProjectMembers from "../ProjectMembers/ProjectMembers";

const ProjectInfo = () => {
    const dispatch = useDispatch()

    const [projectLogo, setProjectLogo] = useState(null)
    const [openMembersEdit, setOpenMembersEdit] = useState(false)

    const projectInfo = useSelector(state => state.currentProject.currentProjectInfo)
    const organizations = useSelector(state => state.organizations.organizations)
    const currentUser = useSelector(state => state.currentUser.currentUser)
    const projectUsers = useSelector(state => state.currentProject.currentUsers);

    useEffect(() => {
        createProjectLogo()
    }, [projectInfo, organizations]);

    useEffect(() => {
        return () => {
            dispatch(setCurrentProjectInfoAction({}))
        }
    }, []);

    const createProjectLogo = () => {
        const projectOrganization = organizations.filter(organization => Number(organization.id) === Number(projectInfo.organization))[0]

        if (typeof projectInfo.organization !== 'undefined' && projectInfo.organization !== null && projectInfo.organization !== '0') {
            setProjectLogo(
                projectOrganization !== undefined
                ? <img
                    src={mainUrl + projectOrganization.logo.SRC}
                    alt={projectOrganization.name}
                ></img>
                : <Skeleton height={30} width={30} circle={true} className="project-info__logo-skeleton"/>
            )
        } else {
            setProjectLogo(null)
        }
    }

    return (
        <div className="project-info">
            <div className="project-info__name">
                {projectLogo &&
                    <div className="project-info__logo">
                        {projectLogo}
                    </div>
                }

                <h4>{projectInfo.name}</h4>
                {currentUser.is_staff && projectUsers.length > 0 &&
                    <div className='project-members'>
                        {projectInfo.name &&
                            <div className='project-members__open-btn'
                                onClick={() => setOpenMembersEdit(!openMembersEdit)}></div>
                        }
                        {openMembersEdit &&
                            <ProjectMembers closeEditMembers={() => setOpenMembersEdit(false)}/>
                        }
                    </div>
            }
        </div>
            <ProjectTeam users={projectInfo.users} creator={projectInfo.user}/>
        </div>
    );
};

export default ProjectInfo;
