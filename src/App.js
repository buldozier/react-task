import './App.scss';
import {BrowserRouter} from "react-router-dom";
import AppRouter from "./router/AppRouter";
import AppHeader from "./components/AppHeader/AppHeader";
import {devMode} from "./constants/constants";
import Application from "./index";

function App() {
    return (
        <BrowserRouter>
            {devMode &&
                <Application/>
            }
            <div className="app page-holder">
                <AppHeader/>
                <AppRouter/>
            </div>
        </BrowserRouter>
    );
}

export default App;
