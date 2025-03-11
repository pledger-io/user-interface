import { mdiAccountPlus, mdiLogin, mdiWeb } from "@mdi/js";
import Icon from "@mdi/react";
import { PrimeReactProvider } from "primereact/api";
import { Card } from "primereact/card";
import { useLocalStorage } from "primereact/hooks";
import { Menu } from "primereact/menu";
import { Message } from "primereact/message";
import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Form, Input, SubmitButton } from "../components/form";
import { i10n, Locales, SupportedLocales } from "../config/prime-locale";
import SecurityRepository from "../core/repositories/security-repository";
import useQueryParam from "../hooks/query-param.hook";

type LoginForm = {
  username: string,
  password: string
}

const Flag = ({ language }: { language: SupportedLocales }) => {
  return <img src={ Locales[language].flag } className='h-[1rem] mr-2' alt='language '/>
}

const Register = () => {
  const [_, setLocale] = useLocalStorage<SupportedLocales>('en', 'language')
  const configMenu = useRef<Menu>(null);
  const [exception, setException] = useState()
  const navigate = useNavigate()
  const [from] = useQueryParam({ key: 'from', initialValue: '/dashboard' })

  const languageMenu = [
    { label: 'English', icon: () => <Flag language='en'/>, command: () => setLocale('en') },
    { label: 'Nederlands', icon: () => <Flag language='nl'/>, command: () => setLocale('nl') },
    { label: 'Deutsch', icon: () => <Flag language='de'/>, command: () => setLocale('de') }
  ]

  const header = <div className='p-4 flex justify-between relative overflow-hidden'>
    <span>Pledger.io</span>
    <Menu model={ languageMenu } popup ref={ configMenu }/>
    <button type='button' className="cursor-pointer z-10" onClick={ (e) => configMenu?.current?.toggle(e) }
            role='button'>
      <Icon path={ mdiWeb } size={ 1 }/>
    </button>
    <img src='images/login-bg.png' className='z-[0] opacity-60 absolute left-0 right-0 top-0 bottom-0'
         alt='background'/>
  </div>


  const onSubmit = ({ username, password }: LoginForm) => SecurityRepository.register(username, password)
    .then(() => navigate('/login?from=' + from))
    .catch(setException)

  return <>
    <Card header={ header }>
      <Form onSubmit={ onSubmit } entity='UserAccount'>
        { exception && <Message text={ i10n('page.login.invalid') } severity='error'/> }

        <Input.Text id='username'
                    title='UserAccount.username'
                    autocomplete='username'
                    type='text'
                    required/>
        <Input.Password id='password' title='UserAccount.password' required/>

        <div className='flex justify-end'>
          <Link to={ `/login?from=${ from }` } className='p-button p-button-link p-button-sm flex gap-1'>
            <Icon path={ mdiLogin } size={ 1 }/>
            { i10n('page.register.login') }
          </Link>
        </div>

        <div className='flex pt-3 items-stretch'>
          <SubmitButton key='login'
                        className='w-full'
                        label='page.register.register' icon={ mdiAccountPlus }/>
        </div>
      </Form>
    </Card>
  </>
}

const _ = () => {
  const [locale] = useLocalStorage<SupportedLocales>('en', 'language')

  return <PrimeReactProvider value={ { locale: locale } }>
    <div className='flex justify-center h-screen items-center'>
      <Register/>
    </div>
  </PrimeReactProvider>
}

export default _
