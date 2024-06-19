import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {Provider} from "react-redux";
import {store} from "./store";
import {Helmet} from "react-helmet";

// закомментировать все импорты ниже для production build, только для разработки локально
import './css/global/font.css';
import './css/global/global.css';
import './css/layout/holster.css';
import './css/layout/blocks.css';
import './css/layout/content.css';

// Добавляет метатеги для разработки
function Application() {
    return (
        <div className="application">
            <Helmet>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                <title>TASK</title>
            </Helmet>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
        <App />
    </Provider>
);

export default Application;
