import React from 'react';
import "./Person.scss"
import {makeInitials} from "../../helpers/helpers";
import {mainUrl} from "../../constants/constants";

const Person = ({ person, hideName = false, size, handler, name }) => {
    let personInitials = makeInitials(person.full_name);
    let sizeClassName = size ? 'person--'+size : '';
    let avatar = person.personal_photo_src ? person.personal_photo_src : false;

    return (
        <div className={'person ' + sizeClassName} data-id={person.id} onClick={(e) => {if(handler) handler(e, [person.id])}}>
            <div className='avatar' title={person.name}>
                {
                    avatar ?
                        <img src={mainUrl + avatar} alt={person.name} title={person.full_name}/> :
                        <span>{personInitials}</span>
                }
            </div>
            {
                !hideName &&
                <div className='person-name'>
                    {
                        name ?
                            <div dangerouslySetInnerHTML={{__html: name}}></div> :
                            <div>{person.full_name}</div>
                    }
                </div>
            }
        </div>
    );
};

export default Person;