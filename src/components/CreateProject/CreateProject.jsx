import React, {useEffect} from 'react';
import MyButton from "../UI/MyButton/MyButton";
import "./CreateProject.scss"
import {useFetching} from "../../hooks/useFetching";
import PostService from "../../API/PostService";
import {useNavigate} from "react-router-dom";
import Dropdown from "../UI/Dropdown/Dropdown";

const CreateProject = () => {
    const [openDropdown, setOpenDropdown] = React.useState(false);
    const [btnDisabled, setBtnDisabled] = React.useState(true);
    const [inputValue, setInputValue] = React.useState('');
    const inputRef = React.useRef();
    const dropdownRef = React.useRef();
    const navigate = useNavigate();

    const [fetchAddProject] = useFetching(async (inputValue) => {
        const response = await PostService.addProject(inputValue)
        if (response.data.success && response.data.result !== false) {
            setBtnDisabled(true);
            setInputValue('');
            setOpenDropdown(false);
            navigate('/' + response.data.result + '/');
        }
    })

    useEffect(() => {
        if(inputRef.current){
            if(openDropdown){
                inputRef.current.focus();
            } else {
                inputRef.current.blur();
            }
        }
    }, [openDropdown, inputRef]);

    const onChangeInput = (e) => {
        let value = e.target.value;
        setBtnDisabled(value === '');
        setInputValue(value);
    }

    const addProject = () => {
        fetchAddProject(inputValue)
    }

    return (
        <div className="project-create" ref={dropdownRef}>
            <MyButton onClick={() => setOpenDropdown(!openDropdown)}>Создать</MyButton>
            {openDropdown &&
                <Dropdown title={'Создать доску'} onClose={() => setOpenDropdown(false)}>
                    <div className='dropdown__input'>
                        <h4>Название доски</h4>
                        <input
                            type='text'
                            name='create-project'
                            value={inputValue}
                            onChange={onChangeInput}
                            ref={inputRef}
                        />
                    </div>
                    <div className={'dropdown__submit' + (btnDisabled ? ' disabled' : '')}>
                        <button onClick={addProject}>Создать</button>
                    </div>
                </Dropdown>
            }
        </div>
    );
};

export default CreateProject;