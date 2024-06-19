import React, {useEffect, useState} from 'react';
import './ProjectMembers.scss'
import MyButtonBlue from "../../UI/MyButtonBlue/MyButtonBlue";
import {useDispatch, useSelector} from "react-redux";
import Person from "../../Person/Person";
import {useFetching} from "../../../hooks/useFetching";
import PostService from "../../../API/PostService";
import {toggleArrayItem} from "../../../helpers/helpers";
import {useParams} from "react-router-dom";
import {setCurrentProjectInfoAction} from "../../../store/currentProject";
import Dropdown from "../../UI/Dropdown/Dropdown";
const ProjectMembers = ({closeEditMembers}) => {
    const [...projectUsers] = useSelector(state => state.currentProject.currentUsers);
    const params = useParams();
    const dispatch = useDispatch()

    const [projectUsersList, setProjectUsersList] = useState([])
    const [searchUsersOriginal, setSearchUsersOriginal] = useState([])
    const [searchUsers, setSearchUsers] = useState([])
    const [usersToDelete, setUsersToDelete] = useState([])
    const [usersToAdd, setUsersToAdd] = useState([])

    const [fetchSearchUsers, isLoadingSearchUsers] = useFetching(async (value) => {
        const response = await PostService.searchUsers(value)
        if (response.data.success && response.data.result !== false) {
            const result = response.data.result.filter(el => {
                return projectUsers.map(item => {
                    return item.id
                }).indexOf(el.id) === -1
            })
            setSearchUsers(result);
            setSearchUsersOriginal(result);
        }
    })

    const [fetchAddProjectUsers] = useFetching(async (projectId, addArr) => {
        await PostService.addProjectUsers(projectId, addArr)
    })

    const [fetchRemoveProjectUsers] = useFetching(async (projectId, deleteArr) => {
        await PostService.removeProjectUsers(projectId, deleteArr)
    })

    const [fetchCurrentProjectInfo] = useFetching(async (projectId) => {
        const response = await PostService.getCurrentProjectInfo(projectId)
        if (response.data.success && response.data.result !== false) {
            dispatch(setCurrentProjectInfoAction(response.data.result))
        }
    })

    useEffect(() => {
        document.addEventListener('click', documentClickHandlerCreate);
        setProjectUsersList(projectUsers)

        return () => document.removeEventListener('click', documentClickHandlerCreate);
    }, []);

    const documentClickHandlerCreate = (e) => {
        if(!e.target.closest('.project-members__open-btn') && !e.target.closest('.project-members-dropdown__close') && !e.target.closest('.project-members-dropdown')){
            closeEditMembers(false)
        }
    };

    const searchUsersHolder = (e) => {
        const value = e.target.value
        if (value !== '') {
            fetchSearchUsers(value);
        } else {
            setSearchUsers([])
            setSearchUsersOriginal([])
        }
    }

    const addUser = (user) => {
        setUsersToAdd([...usersToAdd, user.id])
        if (usersToDelete.length > 0) {
            setUsersToDelete([...usersToDelete.filter(el => el !== user.id)])
        }

        setProjectUsersList([...projectUsersList, user])
        setSearchUsers(searchUsers.filter((i) => {return projectUsersList.concat([user]).map((item) => {return item.id}).indexOf(i.id) === -1}))
    }
    
    const deleteUser = (user) => {
        setUsersToDelete([...usersToDelete, user.id])
        if (usersToAdd.length > 0) {
            setUsersToAdd([...usersToAdd.filter(el => el !== user.id)])
        }

        setProjectUsersList(toggleArrayItem(projectUsersList, user))

        if(searchUsersOriginal.find((item) => {return item.id === user.id})){
            setSearchUsers([...searchUsers, user]);
        }

    }

    const saveUsersList = () => {
        const addArr = usersToAdd.filter(el => projectUsers.indexOf(el) === -1);
        const deleteArr = usersToDelete.filter(id => projectUsers.find(user => user.id === id));

        Promise.all([
                fetchAddProjectUsers(params.id, addArr),
                fetchRemoveProjectUsers(params.id, deleteArr)
        ]).then(() => {
            fetchCurrentProjectInfo(params.id)
            closeEditMembers(false)
        });
    }

    return (
        <Dropdown classes={['project-members-dropdown']} title={'Участники'} onClose={() => closeEditMembers(false)} isLoading={isLoadingSearchUsers}>
            <div className='project-members-dropdown__search'>
                <input
                    type="text"
                    className='search-members'
                    placeholder={'Найти'}
                    onChange={searchUsersHolder}
                />
            </div>
            <div className='project-members-dropdown__list'>
                {projectUsersList && projectUsersList.map((user, index) => {
                    return (
                        <div className='project-members-dropdown__item' key={index}>
                            <Person person={user}/>
                            <div className='delete' onClick={(e) => {
                                e.stopPropagation();
                                deleteUser(user);
                            }}></div>
                        </div>
                    );
                })
                }
                {searchUsers && searchUsers.map((user, index) => {
                    return (
                        <div className='project-members-dropdown__item' key={index}>
                            <Person person={user}/>
                            <div className='add' onClick={(e) => {
                                e.stopPropagation();
                                addUser(user);
                            }}></div>
                        </div>
                    );
                })
                }
            </div>
            <div className='project-members-dropdown__submit'>
                <MyButtonBlue classes={['members-submit']} onClick={saveUsersList}>
                    Сохранить
                </MyButtonBlue>
            </div>
        </Dropdown>
    );
};

export default ProjectMembers;