import React, { useRef, useState } from "react";

import { PrimeReactProvider } from "primereact/api";
import { Card } from "primereact/card";
import { Menu } from "primereact/menu";
import Icon from "@mdi/react";
import { mdiAccountPlus, mdiLogin, mdiWeb } from "@mdi/js";
import { Message } from "primereact/message";
import { i10n, Locales, SupportedLocales } from "../config/prime-locale";
import { Form, Input, SubmitButton } from "../components/form";
import SecurityRepository from "../core/repositories/security-repository";
import { Link, useNavigate } from "react-router";
import useQueryParam from "../hooks/query-param.hook";
import LocalizationService from "../service/localization.service";

type LoginForm = {
  username: string,
  password: string
}

const Flag = ({ language }: { language: SupportedLocales }) => {
  return <img src={ Locales[language].flag } className='h-[1rem] mr-2' alt='language '/>
}

const LoginCard = () => {
  const configMenu = useRef<Menu>(null);
  const navigate = useNavigate()
  const [failure, setFailure] = useState()
  const [from] = useQueryParam({ key: 'from', initialValue: '/dashboard' })

  const languageMenu = [
    { label: 'English', icon: () => <Flag language='en'/>, command: () => LocalizationService.load('en') },
    { label: 'Nederlands', icon: () => <Flag language='nl'/>, command: () => LocalizationService.load('nl') },
    { label: 'Deutsch', icon: () => <Flag language='de'/>, command: () => LocalizationService.load('de') }
  ]

  const header = <div className='p-4 flex justify-between relative overflow-hidden'>
    <span>Pledger.io</span>
    <Menu model={ languageMenu } popup ref={ configMenu }/>
    <button type='button' className="cursor-pointer z-10" onClick={ (e) => configMenu?.current?.toggle(e) }
            role='button'>
      <Icon path={ mdiWeb } size={ 1 }/>
    </button>
    <img src='/ui/images/login-bg.png' className='z-[0] opacity-60 absolute left-0 right-0 top-0 bottom-0'
         alt='background'/>
  </div>

  const onSubmit = (entity: LoginForm) =>
    SecurityRepository.authenticate(entity.username, entity.password)
      .then(() => navigate(from))
      .catch(setFailure)

  return <>
    <Card header={ header } className='md:min-w-[20rem]'>
      { failure && <Message text={ i10n('page.login.invalid') } severity='error'/> }

      <Form entity='UserAccount' onSubmit={ onSubmit }>
        <Input.Text id='username'
                    title='UserAccount.username'
                    autocomplete='username'
                    type='text'
                    required/>
        <Input.Text id='password'
                    title='UserAccount.password'
                    autocomplete='current-password'
                    type='password'
                    required/>

        <div className='flex justify-end'>
          <Link to={ `/register?from=${ from }` } className='p-button p-button-link p-button-sm flex gap-1'>
            <Icon path={ mdiAccountPlus } size={ 1 }/>
            { i10n('page.login.register') }
          </Link>
        </div>

        <div className='flex pt-3 items-stretch'>
          <SubmitButton key='login'
                        className='w-full'
                        label='page.login.login' icon={ mdiLogin }/>
        </div>
      </Form>
    </Card>
  </>
}

const _ = () => {
  return <PrimeReactProvider>
    <div className='flex justify-center h-screen items-center'>
      <LoginCard/>
    </div>
  </PrimeReactProvider>
}

export default _
