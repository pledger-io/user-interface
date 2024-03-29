import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import Sidebar from "./core/sidebar";
import { Layout, Notifications } from "./core";

// Routes import
import { AccountRoutes } from "./account";
import { CategoryRoutes } from "./category";
import { SettingRoutes } from "./setting";
import { ReportRoutes } from "./reports";
import { TransactionRoutes } from "./transactions";
import { RulesRoutes } from "./rules";

import './assets/css/Main.scss'
import './assets/css/Theme.scss'
import { lazy, Suspense, useState } from "react";
import { ContractRoutes } from "./contract";
import { BudgetRoutes } from "./budget";
import { ProfileRoutes } from "./profile";
import MobileSidebar from "./core/sidebar/mobile-sidebar";
import { BatchRoutes } from "./batch";

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
routes.push(...ContractRoutes)
routes.push(...RulesRoutes)
routes.push(...BudgetRoutes)
routes.push(...ProfileRoutes)
routes.push(...BatchRoutes)

function App() {
    const [_, setAuthenticate] = useState(false)

    if (sessionStorage.getItem('token')) {
        return (
            <Suspense>
                <BrowserRouter basename='/ui'>
                    <Sidebar logoutCallback={() => setAuthenticate(false)}/>
                    <MobileSidebar logoutCallback={() => setAuthenticate(false)}/>
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
            <BrowserRouter basename='/ui'>
                <Routes>
                    <Route exact path='/' element={<Navigate to='/login'/>}/>
                    <Route path='/login' element={<LoginCard callback={() => setAuthenticate(true)} />}/>
                    <Route path='/register' element={<RegisterCard />}/>
                    <Route path='/*' element={<Navigate to='/login'/>} />
                </Routes>
                <Suspense fallback={<Layout.Loading/>}>
                    <Outlet />
                </Suspense>
            </BrowserRouter>
        </Suspense>
    )
}

export default App;
