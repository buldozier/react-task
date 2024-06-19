import React from 'react';
import TaskCommentItem from "../TaskCommentItem/TaskCommentItem";
import './TaskCommentList.scss'

const TaskCommentList = ({comments}) => {
	return (
			<>
				{comments.length > 0 &&
						<div className="comments-list">
							{comments.map(comment =>
									<TaskCommentItem
											comment={comment}
											key={comment.id}
									/>
							)}
						</div>
				}
			</>
	);
};

export default TaskCommentList;