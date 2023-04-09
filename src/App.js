import {BrowserRouter, Navigate, Outlet, Route, Routes} from "react-router-dom";
import {Sidebar} from "./core/Sidebar";
import {Loading, Notifications} from "./core";

// Routes import
import {AccountRoutes} from "./account";
import {CategoryRoutes} from "./category";
import {SettingRoutes} from "./setting";
import {ReportRoutes} from "./reports";
import {TransactionRoutes} from "./transactions";

import './assets/css/Main.scss'
import './assets/css/Theme.scss'
import {lazy, Suspense, useState} from "react";
import {ContractRoutes} from "./contract";

const LoginCard = lazy(() => import("./security/LoginCard"));
const RegisterCard = lazy(() => import("./security/RegisterCard"));

const routes = [
    <Route exact path='/' element={<Navigate to='/dashboard'/>} key='index' />
]
routes.push(...AccountRoutes)
routes.push(...CategoryRoutes)
routes.push(...SettingRoutes)
routes.push(...ReportRoutes)
routes.push(...TransactionRoutes)
routes.push(...ContractRoutes)

function App() {
    const [_, setAuthenticate] = useState(false)

    if (sessionStorage.getItem('token')) {
        return (
            <Suspense>
                <BrowserRouter>
                    <Sidebar logoutCallback={() => setAuthenticate(false)}/>
                    <main className='Main'>
                        <Notifications.NotificationCenter />
                        <Routes>
                            {routes}
                        </Routes>
                        <Suspense>
                            <Outlet />
                        </Suspense>
                    </main>
                </BrowserRouter>
            </Suspense>
        );
    }

    return (
        <Suspense>
            <BrowserRouter>
                <Routes>
                    <Route exact path='/' element={<Navigate to='/login'/>}/>
                    <Route path='/login' element={<LoginCard callback={() => setAuthenticate(true)} />}/>
                    <Route path='/register' element={<RegisterCard />}/>
                    <Route path='/*' element={<Navigate to='/login'/>} />
                </Routes>
                <Suspense fallback={<Loading/>}>
                    <Outlet />
                </Suspense>
            </BrowserRouter>
        </Suspense>
    )
}

export default App;
