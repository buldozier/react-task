import React, {useEffect, useRef} from 'react';
import "./Modal.scss"

const Modal = ({classes, children, scrollToPos , closeModalHandler}) => {
    const modalWindow = useRef()
    const modalHolder = useRef()

    const addClasses = classes && classes.length > 0 ? classes.join(" ") : ""


    useEffect(() => {
        setTimeout(() => {
            document.addEventListener('mousedown', documentClickHandlerTeam);
        },[0])

        return () => document.removeEventListener('mousedown', documentClickHandlerTeam);
    }, []);

    useEffect(() => {
        document.addEventListener('keydown', keydownHandler);
        return () => document.removeEventListener('keydown', keydownHandler);
    }, []);

    useEffect(() => {
        if(scrollToPos > 0) {
            let topElement = document.getElementById(scrollToPos)
            if(topElement) {
                const top = topElement.getBoundingClientRect().top - 200;
                const commentContent = topElement.querySelector('.comment__content-value')

                setTimeout(() => {
                    modalHolder.current.scrollTo({
                        top: top,
                        behavior: "smooth",
                    })
                    commentContent.classList.add('highlight')
                }, 10)

                setTimeout(() => {
                    commentContent.classList.remove('highlight')
                }, 1500)
            }
        }
    }, [scrollToPos]);

    const keydownHandler = (e) => {
        switch (e.code) {
            case 'Escape':
                closeHandler()
                break;
            default:
        }
    }
    const closeHandler = () => {
        if(modalHolder.current){
            modalHolder.current.classList.add('remove-animation');
        }

        closeModalHandler()
    }


    const documentClickHandlerTeam = (e) => {
        if(!modalWindow.current) return;
        if(!modalWindow.current.contains(e.target)){
            closeHandler()
        }
    };

    return (
        <div className={"modal-holder g-hide-scrollbar " + addClasses} ref={modalHolder}>
            <div className="modal" ref={modalWindow}>
                <div className="modal__top">
                    <div className="modal__close-holder">
                        <span className="modal__close" onClick={closeHandler}></span>
                    </div>
                </div>
                <div className="modal__content">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;