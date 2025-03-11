import React, {useRef, useState} from "react";

import {Form, Input, SubmitButton} from "../components/form";
import {mdiAccountPlus, mdiLogin, mdiWeb} from "@mdi/js";
import {Link, useNavigate} from "react-router";
import {Message} from "primereact/message";

import SecurityRepository from "../core/repositories/security-repository";

import useQueryParam from "../hooks/query-param.hook";

import Icon from "@mdi/react";
import {i10n, Locales, SupportedLocales} from "../config/prime-locale";
import {PrimeReactProvider} from "primereact/api";
import LocalizationService from "../service/localization.service";
import {Menu} from "primereact/menu";
import {Card} from "primereact/card";

type LoginForm = {
    username: string,
    password: string
}

const Flag = ({language}: { language: SupportedLocales }) => {
    return <img src={Locales[language].flag} className='h-[1rem] mr-2' alt='language '/>
}

const languageMenu = [
    {label: 'English', icon: () => <Flag language='en'/>, command: () => LocalizationService.load('en')},
    {label: 'Nederlands', icon: () => <Flag language='nl'/>, command: () => LocalizationService.load('nl')},
    {label: 'Deutsch', icon: () => <Flag language='de'/>, command: () => LocalizationService.load('de')}
]

const Register = () => {
    const configMenu = useRef<Menu>(null);
    const [exception, setException] = useState()
    const navigate = useNavigate()
    const [from] = useQueryParam({key: 'from', initialValue: '/dashboard'})

    const header = <div className='p-4 flex justify-between relative overflow-hidden'>
        <span>Pledger.io</span>
        <Menu model={languageMenu} popup ref={configMenu}/>
        <button className="cursor-pointer z-10" onClick={(e) => configMenu?.current?.toggle(e)} role='button'>
            <Icon path={mdiWeb} size={1}/>
        </button>
        <img src='images/login-bg.png' className='z-[0] opacity-60 absolute left-0 right-0 top-0 bottom-0'/>
    </div>


    const onSubmit = ({username, password}: LoginForm) => SecurityRepository.register(username, password)
        .then(() => navigate('/login?from=' + from))
        .catch(setException)

    return <>
        <Card header={header}>
            <Form onSubmit={onSubmit} entity='UserAccount'>
                {exception && <Message text={i10n('page.login.invalid')} severity='error' />}

                <Input.Text id='username'
                            title='UserAccount.username'
                            autocomplete='username'
                            type='text'
                            required/>
                <Input.Password id='password' title='UserAccount.password' required />

                <div className='flex justify-end'>
                    <Link to={`/login?from=${ from }`} className='p-button p-button-link p-button-sm flex gap-1'>
                        <Icon path={mdiLogin} size={1}/>
                        {i10n('page.register.login')}
                    </Link>
                </div>

                <div className='flex pt-3 items-stretch'>
                    <SubmitButton key='login'
                                  className='w-full'
                                  label='page.register.register' icon={mdiAccountPlus}/>
                </div>
            </Form>
        </Card>
    </>
}

const _ = () => {
    return <PrimeReactProvider>
        <div className='flex justify-center h-screen items-center'>
            <Register />
        </div>
    </PrimeReactProvider>
}

export default _
