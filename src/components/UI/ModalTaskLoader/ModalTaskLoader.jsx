import React from 'react';
import './ModalTaskLoader.scss'
import Skeleton, {SkeletonTheme} from "react-loading-skeleton";

const ModalTaskLoader = () => {
    return (
        <div className="modal-task-loader">
            <SkeletonTheme
                baseColor={"rgba(9, 30, 66, 0.0588235294)"}
                highlightColor={"rgba(9, 30, 66, 0.1411764706)"}
                borderRadius={10}
            >
                <Skeleton className="modal-task-loader__title" height={65}/>
                <div className="modal-task-loader__bottom">
                    <div className="modal-task-loader__bottom-left">
                        <Skeleton height={302}/>
                        <Skeleton height={96}/>
                    </div>
                    <div className="modal-task-loader__bottom-right">
                        <Skeleton height={98} className="modal-task-loader__bottom-right-header"/>
                        <Skeleton height={50}/>
                        <div className="modal-task-loader__bottom-right-properties">
                            <Skeleton height={32}/>
                            <Skeleton height={32}/>
                            <Skeleton height={54}/>
                            <Skeleton height={54}/>
                        </div>
                    </div>
                </div>
            </SkeletonTheme>
        </div>
    );
};

export default ModalTaskLoader;