import React, {useEffect} from 'react';
import './ProjectTeam.scss'
import Person from "../../Person/Person";
import {useFetching} from "../../../hooks/useFetching";
import PostService from "../../../API/PostService";
import Skeleton from "react-loading-skeleton";
import {useDispatch, useSelector} from "react-redux";
import {setCurrentUsersAction} from "../../../store/currentProject";

const ProjectTeam = ({users, creator}) => {
    const dispatch = useDispatch()

    const usersList = useSelector(state => state.currentProject.currentUsers)

    const [fetchProjectUsers] = useFetching(async (userId) => {
        const response = await PostService.getUsers(userId)
        if (response.data.success && response.data.result !== false && response.data.result.length > 0) {
            dispatch(setCurrentUsersAction(response.data.result))
        }
    })

    useEffect(() => {
        if (users) {
            fetchProjectUsers([...users])
        }

        return () => dispatch(setCurrentUsersAction([]))
    }, [users]);

    return (
        <div className="project-team">
            {usersList.length !== 0
                ? usersList.map((el, index) => {
                    let isCreator = !!creator && creator == el.id;
                    return(
                        <div className={'project-team__item' + (isCreator ? ' is-creator' : '')} key={index}>
                            <Person person={el} hideName/>
                        </div>
                    );
                })
                : <div className="project-team__item-loading">
                    <Skeleton className={"is-creator"} width={28} height={28} circle={true}/>
                    <Skeleton width={28} height={28} circle={true}/>
                </div>
            }
        </div>
    );
};

export default ProjectTeam;