import React, {useEffect, useState} from 'react';
import "./UserProjects.scss"
import {useFetching} from "../../../hooks/useFetching";
import PostService from "../../../API/PostService";
import {useDispatch, useSelector} from "react-redux";
import {setUserProjectsAction, setUserProjectsMarkedListAction} from "../../../store/userProjectReducer";
import {Link} from "react-router-dom";
import {mainUrl} from "../../../constants/constants";

const UserProjects = () => {
    const dispatch = useDispatch()
    const userProjects = useSelector(state => state.userProjects.userProjects)
    const userProjectsMarkedList = useSelector(state => state.userProjects.userProjectsMarkedList)
    const organizations = useSelector(state => state.organizations.organizations)

    const [listOpen, setListOpen] = useState(false)
    const dropdownRef = React.useRef();

    const [fetchUserProjects] = useFetching(async () => {
        const response = await PostService.getUserProjects()
        if (response.data.success && response.data.result !== false) {
            dispatch(setUserProjectsAction(response.data.result))
        }
    })

    const [fetchUserProjectsMarked] = useFetching(async () => {
        const response = await PostService.getUserProjectsMarked()
        if (response.data.success && response.data.result !== false) {
            dispatch(setUserProjectsMarkedListAction(response.data.result));
        }
    })

    useEffect(() => {
        document.addEventListener('click', documentClickHandlerTeam);
        fetchUserProjects()
        fetchUserProjectsMarked()
        return () => document.removeEventListener('click', documentClickHandlerTeam);
    }, []);

    const documentClickHandlerTeam = (e) => {
        if(!dropdownRef.current) return;
        if(!dropdownRef.current.contains(e.target)){
            setListOpen(false);
        }
    };

    const openDropdown = () => {
        setListOpen(!listOpen);
        fetchUserProjectsMarked()
    }


    return (
        <div className="header-selector" ref={dropdownRef}>
            <div className='header-selector__btn' onClick={openDropdown}>
                Выбор доски
            </div>
            {listOpen &&
                <div className="header-selector__dropdown g-hide-scrollbar">
                    <div className="header-projects-list">
                        {userProjects.map((project, index) => {
                            let image
                            const projectOrganization = organizations.filter(organization => organization.id === project.organization)[0]

                            if(typeof project.organization !== 'undefined' && project.organization !== null && project.organization !== '0') {
                                image = projectOrganization !== undefined
                                    /////// ДЛЯ РАЗРАБОТКИ
                                    ? <img src={mainUrl + projectOrganization.logo.SRC} alt={projectOrganization.name}></img>
                                    /////// ДЛЯ РАЗРАБОТКИ
                                    // ? <img src={projectOrganization.logo.SRC} alt={projectOrganization.name}></img>
                                    : <div className='header-projects-list__item-background-img'></div>
                            }
                            return(
                                <div
                                    className='header-projects-list__item-holder'
                                    key={index}
                                    onClick={() => setListOpen(false)}
                                >
                                    <Link to={'/' + project.id + '/'} id={project.id}>
                                        {
                                            image
                                        }
                                        <div className='header-projects-list__item'>
                                            {project.name}
                                        </div>
                                        { userProjectsMarkedList[project.id] === true &&
                                            <div className='header-projects-list__item-marker'></div>
                                        }
                                    </Link>
                                </div>

                            );
                        })}
                    </div>
                </div>
            }
        </div>
    );
};

export default UserProjects;