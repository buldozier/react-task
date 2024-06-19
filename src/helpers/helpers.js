import {Link, useLocation} from "react-router-dom";

const months = {
    0: 'января',
    1: 'февраля',
    2: 'марта',
    3: 'апреля',
    4: 'мая',
    5: 'июня',
    6: 'июля',
    7: 'августа',
    8: 'сентября',
    9: 'октября',
    10: 'ноября',
    11: 'декабря',
}

const monthsShorts = {
    0: 'янв',
    1: 'фев',
    2: 'мар',
    3: 'апр',
    4: 'мая',
    5: 'июня',
    6: 'июля',
    7: 'авг',
    8: 'сен',
    9: 'окт',
    10: 'ноя',
    11: 'дек',
}

export const CreateTaskLogo = () => {
    const location = useLocation();

    if (location.pathname === '/') {
        return (
            <div className='task-logo'>
                <span>T</span><span>A</span><span>S</span><span>K</span>
            </div>
        );
    } else {
        return (
            <Link to="/" className='task-logo'>
                <span>T</span><span>A</span><span>S</span><span>K</span>
            </Link>
        );
    }
}

export const makeInitials = (name) => {
    if(!name) return '';
    return name.split(/\s+/).slice(0,2).map(word => {
        if(word){
            return word[0].toUpperCase();
        } else {
            return '';
        }
    }).join('');
}

export const toggleArrayItem = (array, item) => {
    let elIndex = array.indexOf(item);
    let newArray = array;
    if (elIndex !== -1) {
        newArray.splice(elIndex, 1);
    } else {
        newArray = newArray.concat([item]);
    }

    return newArray;
}

export const getDateString = (timestamp, dateString, deadline = false) => {
    const now = new Date();

    const fullDate = new Date(timestamp);

    const getHours = () => {
        return fullDate.getHours() < 10 ? "0" + fullDate.getHours() : fullDate.getHours();
    }
    const getMinutes = () => {
        return fullDate.getMinutes() < 10 ? "0" + fullDate.getMinutes() : fullDate.getMinutes();
    }
    const month = fullDate.getMonth();
    const dayOfWeek = fullDate.toLocaleString('ru-RU', { weekday: 'short' });


    let result = `${dateString.slice(0, 10)} в ${getHours()}:${getMinutes()}`

    if (fullDate.getFullYear() === now.getFullYear()) {
        result = `${fullDate.getDate()} ${months[month]}, ${dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1)} в ${getHours()}:${getMinutes()}`
    }

    if(deadline) {

        result = `${fullDate.getDate()} ${monthsShorts[month]} ${fullDate.getFullYear()} г.`

        if (fullDate.getFullYear() === now.getFullYear()) {
            result = `${fullDate.getDate()} ${monthsShorts[month]}`
        }
    }

    return result;
}


export const getNotificationDateString = (timestamp) => {
    const dateNow = new Date();
    const date = new Date(timestamp);

    const addZero = (param) => {
        return param < 10 ? '0' + param : param;
    }
    const oneDay = 86400000;
    const hours = addZero(date.getHours());
    const minutes = addZero(date.getMinutes());
    const day = addZero(date.getDate());
    let res = `в ${hours}:${minutes}`;

    if(dateNow.getFullYear() !== date.getFullYear()) {
        res = `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()} ${res}`;
    } else if(Math.abs(date.getDate() - dateNow.getDate()) >= 2) {
        res = `${day} ${months[date.getMonth()]} ${res}`;
    } else if(Math.abs(date.getDate() - dateNow.getDate()) === 1 && dateNow - date <= 2 * oneDay) {
        res = `Вчера ${res}`;
    } else if(Math.abs(date.getDate() - dateNow.getDate()) === 0) {
        res = `Сегодня ${res}`;
    } else if(Math.abs(date.getDate() - dateNow.getDate()) < 2 && dateNow.getMonth() !== date.getMonth()) {
        res = `${day} ${months[date.getMonth()]} ${res}`;
    }

    return res;
}

export const copyURL = (taskCopy) => {
    let tempInput = document.createElement('textarea');

    tempInput.style.fontSize = '12pt';
    tempInput.style.border = '0';
    tempInput.style.padding = '0';
    tempInput.style.margin = '0';
    tempInput.style.position = 'absolute';
    tempInput.style.left = '-9999px';
    tempInput.setAttribute('readonly', '');

    tempInput.value = decodeURI(window.location.href);

    taskCopy.current.appendChild(tempInput);

    tempInput.select();
    tempInput.setSelectionRange(0, 99999);

    document.execCommand('copy');

    taskCopy.current.removeChild(tempInput);

    taskCopy.current.children[0].textContent = "Скопирована";
    taskCopy.current.children[0].classList.add('copy');

    setTimeout(() => {
        taskCopy.current.children[0].textContent = 'Ссылка';
        taskCopy.current.children[0].classList.remove('copy');
    }, 700)
}
