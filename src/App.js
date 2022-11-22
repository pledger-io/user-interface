import RestAPI from "./core/RestAPI";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {Sidebar} from "./core/Sidebar";
import RegisterCard from "./security/RegisterCard";
import {LoginCard} from "./security/LoginCard";
import {Notifications} from "./core";

// Routes import
import {AccountRoutes} from "./account";
import {CategoryRoutes} from "./category";
import {SettingRoutes} from "./setting";
import {ReportRoutes} from "./reports";
import {TransactionRoutes} from "./transactions";

import './assets/css/Main.scss'
import './assets/css/Theme.scss'

const routes = [
    <Route exact path='/' element={<Navigate to='/dashboard'/>} key='index' />
]
routes.push(...AccountRoutes)
routes.push(...CategoryRoutes)
routes.push(...SettingRoutes)
routes.push(...ReportRoutes)
routes.push(...TransactionRoutes)

function App() {
    if (RestAPI.user()) {
        return (
            <BrowserRouter>
                <Sidebar/>
                <main className='Main'>
                    <Notifications.NotificationCenter />
                    <Routes>
                        {routes}
                    </Routes>
                </main>
            </BrowserRouter>
        );
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route exact path='/' element={<Navigate to='/login'/>}/>
                <Route path='/login' element={<LoginCard />}/>
                <Route path='/register' element={<RegisterCard />}/>
                <Route path='/*' element={<Navigate to='/login'/>} />
            </Routes>
        </BrowserRouter>
    )
}

export default App;
