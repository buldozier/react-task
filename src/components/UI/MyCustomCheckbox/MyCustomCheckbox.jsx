import React, {useState} from 'react';
import './MyCustomCheckbox.scss'

const MyCustomCheckbox = ({defaultState, onChange}) => {

	const [isActive, setIsActive] = useState(defaultState)

	const onClickHolder = (e) => {
		e.stopPropagation()
		setIsActive(!isActive)
		onChange(!isActive)
	}

	return (
			<div className={`custom-checkbox ${isActive ? 'active' : ''}`} onClick={onClickHolder}>
				{isActive &&
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
						<path d="M0 11l2-2 5 5L18 3l2 2L7 18z"/>
					</svg>
				}

			</div>
	);
};

export default MyCustomCheckbox;
