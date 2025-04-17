import { NavLink } from "react-router";
import { i10n } from "../../config/prime-locale";

const NavigationComponent = () => {

    return <>
        <section className='mb-4'>
            <h1 className='font-bold'>{i10n('page.user.profile.theme')}</h1>

            {/*<NavLink to="/user/profile/theme" className='block ml-3'>{i10n('page.user.profile.theme')}</NavLink>*/}
            <NavLink to="/user/profile/currency" className='block ml-3'>{i10n('page.user.profile.currency')}</NavLink>
        </section>

        <section className='mb-4'>
            <h1 className='font-bold'>Security</h1>

            <NavLink to="/user/profile/two-factor" className='block ml-3'>{i10n('page.user.profile.twofactor')}</NavLink>
            <NavLink to="/user/profile/sessions" className='block ml-3'>{i10n('page.title.user.session.active')}</NavLink>
            <NavLink to="/user/profile/password" className='block ml-3'>{i10n('page.header.user.password')}</NavLink>
        </section>

        <section className='mb-4'>
            <h1 className='font-bold'>Import / Export</h1>

            <NavLink to="/user/profile/import" className='block ml-3'>{i10n('page.user.profile.import')}</NavLink>
            <NavLink to="/user/profile/export" className='block ml-3'>{i10n('page.user.profile.export')}</NavLink>
            <NavLink to="/user/profile/transactions" className='block ml-3'>{i10n('page.user.profile.transactions')}</NavLink>
        </section>
    </>
}

export default NavigationComponent
