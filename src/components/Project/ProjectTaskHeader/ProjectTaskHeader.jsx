import React from 'react';
import MyTextarea from "../../UI/MyTextaerea/MyTextarea";
import Skeleton from "react-loading-skeleton";

const ProjectTaskHeader = ({isLoadingFetchGetCurrentTask, nameValue, onBlurNameHandler, changeNameHolder}) => {
	return (
		<>
			{!isLoadingFetchGetCurrentTask
				?
				<div className='task__top-title'>
					<MyTextarea
						value={nameValue}
						onBlur={onBlurNameHandler}
						onChange={changeNameHolder}
					/>
				</div>
				:
				<Skeleton
					height={43}
					baseColor={"rgba(9, 30, 66, 0.0588235294)"}
					highlightColor={"rgba(9, 30, 66, 0.1411764706)"}
					borderRadius={10}
				/>
			}
		</>
	);
};

export default ProjectTaskHeader;