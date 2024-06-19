import React, {useEffect, useRef} from 'react';
import './Dropdown.scss'
import MyLoaderSpinner from "../MyLoaderSpinner/MyLoaderSpinner";

const Dropdown = ({children, classes, title, onClose, isLoading}) => {
	const dropdown = useRef()

	const addClasses = classes && classes.length > 0 ? classes.join(" ") : ""

	useEffect(() => {
		setTimeout(() => {
			document.addEventListener('click', documentClickHandlerTeam);
		},[0])

		return () => document.removeEventListener('click', documentClickHandlerTeam);
	}, []);

	const documentClickHandlerTeam = (e) => {
		if(!dropdown.current) return;
		if(!dropdown.current.contains(e.target)){
			onClose(e)
		}
	};

	return (
			<div className={"dropdown " + addClasses} ref={dropdown}>
				<div className="dropdown__header">
					<h4 className="dropdown__title">{title}</h4>
					{isLoading &&
							<MyLoaderSpinner/>
					}
					<span className="dropdown__close" onClick={onClose}></span>
				</div>
				<div className="dropdown__content">{children}</div>
			</div>
	);
};

export default Dropdown;