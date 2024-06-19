import React, {useEffect, useRef} from 'react';
import Calendar from "react-calendar";
import './MyDatePicker.scss'
import MyButton from "../MyButton/MyButton";
import Dropdown from "../Dropdown/Dropdown";

const MyDatePicker = ({title, date, onClickDay, onCloseHandler, onDeleteDate}) => {

	const datePicker = useRef()

	useEffect(() => {
		setTimeout(() => {
			document.addEventListener('click', documentClickHandlerTeam);
		},)

		return () => document.removeEventListener('click', documentClickHandlerTeam);
	}, []);

	const documentClickHandlerTeam = (e) => {
		if(!datePicker.current) return;
		if(!datePicker.current.contains(e.target) && (!e.target.classList.contains('react-calendar__tile') && !e.target.ariaLabel)){
			onCloseHandler()
		}
	};

	const onClickDeleteDate = () => {
		if(onDeleteDate) {
			onDeleteDate()
		}
	}

	return (
		<Dropdown onClose={onCloseHandler} title={title} classes={['date-picker']}>
			<Calendar value={date} onClickDay={onClickDay}/>
			{date &&
					<MyButton style={{marginTop: 10}} onClick={onClickDeleteDate}>Удалить дедлайн</MyButton>
			}
		</Dropdown>
	);
};

export default MyDatePicker;