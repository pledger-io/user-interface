// Routes import
import './assets/css/Main.scss'
import './assets/css/Theme.scss'
import { lazy } from "react";

const LoginCard = lazy(() => import("./pages/login"));
const RegisterCard = lazy(() => import("./pages/register"));


function App() {
    // const [isAuthenticated, setAuthenticate] = useState(false) //eslint-disable-line
    // const [twoFactorNeeded, setTwoFactor] = useState(false) //eslint-disable-line
    //
    // const authenticated = () => {
    //     RestAPI.profile()
    //         .then(() => {
    //             setAuthenticate(true)
    //             setTwoFactor(false)
    //             CurrencyRepository.list().then(() => {
    //                 const profile: any = RestAPI.user()
    //                 profile.defaultCurrency = CurrencyRepository.cached(profile.currency)
    //             })
    //
    //         })
    //         .catch((ex: AxiosError) => {
    //             if (ex.response?.status === 403) {
    //                 setTwoFactor(true)
    //             }
    //         })
    // }
    // const logout = () => {
    //     SecurityRepository.logout()
    //     setAuthenticate(false)
    // }
    //
    // useEffect(() => {
    //     console.log('App mounted')
    //     if (SecurityRepository.isAuthenticated()) {
    //         authenticated()
    //     }
    //
    //     window.addEventListener('credentials-expired', logout)
    // }, [])
    //
    // if (twoFactorNeeded) {
    //     return (
    //         <Suspense>
    //             <BrowserRouter basename='/ui'>
    //                 <Notifications.NotificationCenter />
    //                 <Routes>
    //                     <Route key='two-factor' path="/two-factor" element={<TwoFactorCard callback={ authenticated }/>}/>
    //                     <Route key='redirect' path='/*' element={<Navigate to='/two-factor'/>}/>
    //                 </Routes>
    //             </BrowserRouter>
    //         </Suspense>
    //     )
    // }
    //
    // if (isAuthenticated) {
    //     return (
    //         <Suspense>
    //             <BrowserRouter basename='/ui'>
    //                 <Sidebar logoutCallback={ logout }/>
    //                 <MobileSidebar logoutCallback={ logout }/>
    //                 <main className='Main px-2 md:px-5 h-[100vh] flex flex-col overflow-y-auto'>
    //                     <Notifications.NotificationCenter />
    //                     <Routes>
    //                         {routes}
    //                         <Route path='/*' element={<Navigate to='/dashboard'/>}/>
    //                     </Routes>
    //                     <Suspense>
    //                         <Outlet />
    //                     </Suspense>
    //                 </main>
    //             </BrowserRouter>
    //         </Suspense>
    //     );
    // }
    //
    // if (sessionStorage.getItem('token')) {
    //     return <div className='h-[100vh] w-full flex justify-center items-center'>
    //             <Layout.Loading />
    //     </div>
    // }
    //
    // return (
    //     <Suspense>
    //         <BrowserRouter basename='/ui'>
    //             <Routes>
    //                 <Route path='/' element={<Navigate to='/login'/>}/>
    //                 <Route path='/login' element={<LoginCard callback={ authenticated } />}/>
    //                 <Route path='/register' element={<RegisterCard />}/>
    //                 <Route path='/*' element={<Navigate to='/login'/>} />
    //             </Routes>
    //             <Suspense fallback={<Layout.Loading/>}>
    //                 <Outlet />
    //             </Suspense>
    //         </BrowserRouter>
    //     </Suspense>
    // )
}

export default App;
