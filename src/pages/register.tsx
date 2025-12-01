import { mdiAccountPlus, mdiLogin, mdiWeb } from "@mdi/js";
import Icon from "@mdi/react";
import { PrimeReactProvider } from "primereact/api";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { useLocalStorage } from "primereact/hooks";
import { Menu } from "primereact/menu";
import { Message } from "primereact/message";
import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Form, Input, SubmitButton } from "../components/form";
import { i10n } from "../config/prime-locale";
import { ThemeProvider } from "../context/theme-context";
import { Locales, SupportedLocales } from "../core/repositories/i18n-repository";
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
  const [_, setLocale] = useLocalStorage<string>('en', 'language')
  const configMenu = useRef<Menu>(null);
  const [exception, setException] = useState()
  const navigate = useNavigate()
  const [from] = useQueryParam({ key: 'from', initialValue: '/dashboard' })

  const languageMenu = [
    { label: 'English', icon: () => <Flag language='en'/>, command: () => setLocale('en') },
    { label: 'Nederlands', icon: () => <Flag language='nl'/>, command: () => setLocale('nl') },
    { label: 'Deutsch', icon: () => <Flag language='de'/>, command: () => setLocale('de') }
  ]

  const header = <div className='p-4 flex justify-between items-center relative overflow-hidden bg-gray-700/20 border-b-gray-500/20 border-b-1'>
    <span/>
    <span className="text-2xl font-bold text-blue-800/70">Pledger.io</span>
    <Menu model={ languageMenu } popup ref={ configMenu }/>
    <button type='button' className="cursor-pointer z-10 p-2 hover:bg-gray-100 rounded-full transition-all"
            onClick={ (e) => configMenu?.current?.toggle(e) }
            role='button'>
      <Icon path={ mdiWeb } size={ 1 }/>
    </button>
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
                    icon='user'
                    type='text'
                    required/>
        <Input.Password id='password' title='UserAccount.password' required/>

        <div className='flex pt-3 items-stretch'>
          <SubmitButton key='login'
                        className='w-full p-button-lg'
                        label='page.register.register' icon={ mdiAccountPlus }/>
        </div>
      </Form>

      <Divider align="center">
        <span className="text-gray-500 text-sm">{i10n('common.lang.or')}</span>
      </Divider>

      <div className='flex justify-center mt-3'>
        <Link to={ `/login?from=${ from }` } className='p-button p-button-info p-button-outlined p-button-lg flex gap-2 items-center w-full justify-center'>
          <Icon path={ mdiLogin } size={ 1 }/>
          { i10n('page.register.login') }
        </Link>
      </div>
    </Card>
  </>
}

const _ = () => {
  const [locale] = useLocalStorage<SupportedLocales>('en', 'language')

  return <PrimeReactProvider value={ { locale: locale } }>
    <ThemeProvider>
      <div className='flex justify-center h-screen items-center'>
        <Register/>
      </div>
    </ThemeProvider>
  </PrimeReactProvider>
}

export default _
