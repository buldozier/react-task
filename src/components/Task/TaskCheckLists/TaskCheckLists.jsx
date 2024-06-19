import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import { useFetching } from '../../../hooks/useFetching';
import PostService from '../../../API/PostService';
import "./TaskCheckLists.scss"
import MyCustomCheckbox from '../../UI/MyCustomCheckbox/MyCustomCheckbox';

export const TaskCheckLists = ({task}) => {
    const dispatch = useDispatch();
    const projectInfo = useSelector(state => state.currentProject.currentProjectInfo);
    const [checkLists, setCheckLists] = useState(task.check_lists);

    return(
        <div className='task-checklists'>
            {
                checkLists.map((list) => {
                    return(
                        <CheckList checkList={list} key={list.id}/>
                    );
                })
            }
        </div>
    )
}

const CheckList = ({checkList}) => {
    const dispatch = useDispatch();

    const [list, setList] = useState(checkList);
    const [listCounter, setListCounter] = useState({checked: list.counter.checked, total: list.counter.total});

    const updateList = (itemId, state) => {
        let updatedList = list;
        updatedList.items[Number(itemId)].state = state;
        setList(updatedList);

        updateCounter(updatedList);
        fetchUpdateCheckList(checkList.id, updatedList);
    }

    const addItem = (value) => {
        let updatedList = list;
        updatedList.items.push({
            state: false,
            item: value,
        });
        setList(updatedList);

        updateCounter(updatedList);
        fetchUpdateCheckList(checkList.id, updatedList);
    }

    const updateCounter = (list) => {
        let checkedItems = list.items.filter((el) => {return el.state});
        let checked = checkedItems.length;
        let total = list.items.length;
        setListCounter({checked: checked, total: total});
    }

    const [fetchUpdateCheckList] = useFetching(async (listId, data) => {
        await PostService.updateCheckList(listId, JSON.stringify(data))
    })

    return(
        <div className='task-checklists__item'>
            <div className="task-checklists__item-header">
                <h4 className='task-checklists__item-header-name'>{list.name}</h4>
                <div className="task-checklists__item-header-counter">Выполнено: {listCounter.checked} из {listCounter.total}</div>
            </div>
            {
                list.items && Array.isArray(list.items) &&
                <ol>
                    {
                        list.items.map((item) => {
                            return(
                                <CheckListItem checkListItem={item} updateList={updateList} key={list.id+'_'+item.id}/>
                            )
                        })
                    }
                </ol>
            }
            <AddListItem addItem={addItem}/>
        </div>
    )
}

const CheckListItem = ({checkListItem, updateList}) => {
    const [state, setState] = useState(checkListItem.state);

    const updateItemState = (state) => {
        setState(state);
        updateList(checkListItem.id, state)
    }

    return(
        <li className="task-checklists__item-point">
            <MyCustomCheckbox defaultState={state} onChange={updateItemState}/>
            <div className="task-checklists__item-point-value" style={{'textDecoration':(state) ? 'line-through' : 'none'}}>{checkListItem.item}</div>
        </li>
    )
}

const AddListItem = ({ addItem }) => {
    const [inputOpen, setInputOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');

    const addPoint = () => {
        setInputOpen(true);
    }

    const setNewItem = (value) => {
        addItem(value);
        setInputValue('');
    }

    const onKeyDown = (e) => {
        if(e.code === 'Enter' || e.keyCode === 13){
            setNewItem(e.target.value);
        }
    }

    return(
        <div>
            {
                inputOpen &&
                <input type='text' value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={onKeyDown} onBlur={() => setInputOpen(false)}/>
            }
            <button onClick={addPoint}>добавить пункт</button>
        </div>
    )
}
