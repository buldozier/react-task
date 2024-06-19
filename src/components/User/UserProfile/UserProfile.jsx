import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import Person from "../../Person/Person";
import {Link} from "react-router-dom";
import "./UserProfile.scss"
import {useFetching} from "../../../hooks/useFetching";
import PostService from "../../../API/PostService";
import {setCurrentUserAction} from "../../../store/currentUserReducer";

const UserProfile = () => {
    const dispatch = useDispatch()
    const [open, setOpen] = React.useState(false);
    const currentUser = useSelector(state => state.currentUser.currentUser)
    const dropdownRef = React.useRef();

    const [fetchLogout] = useFetching(async () => {
        const response = await PostService.logout()
        if (response.data.success && response.data.result !== false) {
            dispatch(setCurrentUserAction({}))
            window.location.reload();

        }
    })

    const documentClickHandler = (e) => {
        if(!dropdownRef.current) return;
        if(!dropdownRef.current.contains(e.target)){
            setOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', documentClickHandler);
        return () => document.removeEventListener('click', documentClickHandler);
    }, []);

    const openDropdown = () => {
        setOpen(!open);
    }

    const logout = (e) => {
        e.preventDefault()
        fetchLogout()
    }

    return (
        <div className="user" ref={dropdownRef}>
            <div className='user__holder' onClick={openDropdown}>
                <Person person={currentUser} hideName/>
            </div>
            {open &&
                <div className='user-dropdown'>
                    <div className='user-dropdown__info'>
                        <div className='user-dropdown__info-avatar'>
                            <Person person={currentUser} hideName size={'l'}/>
                        </div>
                        <div className='user-dropdown__info-contact'>
                            <div className=''>{currentUser.full_name}</div>
                            {
                                currentUser.email &&
                                <div className=''>{currentUser.email}</div>
                            }
                        </div>
                    </div>
                    <div className='user-dropdown__list'>
                        <div className='user-dropdown__list-item'>
                            <a href={'/bitrix/admin/user_edit.php?ID=' + currentUser.id} className=''>Профиль</a>
                        </div>
                        <div className='user-dropdown__list-item'>
                            <Link to='/' onClick={logout} className=''>Выйти</Link>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
};

export default UserProfile;