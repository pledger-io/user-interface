import { mdiAccountPlus, mdiLogin, mdiWeb } from "@mdi/js";
import Icon from "@mdi/react";
import { PrimeReactProvider } from "primereact/api";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { useLocalStorage } from "primereact/hooks";
import { Menu } from "primereact/menu";
import { Toast } from "primereact/toast";
import React, { useRef } from "react";
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

const LoginCard = () => {
  const [_, setLocale] = useLocalStorage<string>('en', 'language')
  const configMenu = useRef<Menu>(null);
  const toast = useRef<Toast>(null);
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

  const onSubmit = (entity: LoginForm) =>
    SecurityRepository.authenticate(entity.username, entity.password)
      .then(() => {
        toast.current?.show({
          severity: 'success',
          summary: 'Success',
          detail: i10n('page.login.success'),
          life: 3000
        });

        setTimeout(() => navigate(from), 1000);

      })
      .catch(() => {
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: i10n('page.login.invalid'),
          life: 3000
        });
      })


  return <>
    <Toast ref={ toast } position="top-right" />
    <Card header={ header } className='md:min-w-[24rem] shadow-2xl'>
      <div className="text-center mb-5">
        <h2 className="text-2xl font-semibold text-gray-800">{ i10n('page.login.welcome') }</h2>
        <p className="text-gray-600">{ i10n('page.login.subtitle') }</p>
      </div>

      <Form entity='UserAccount' onSubmit={ onSubmit }>
        <Input.Text id='username'
                    title='UserAccount.username'
                    autocomplete='username'
                    type='text'
                    icon='user'
                    required/>

        <Input.Text id='password'
                    title='UserAccount.password'
                    autocomplete='current-password'
                    icon='lock'
                    type='password'
                    required/>

        <div className='flex pt-3 items-stretch'>
          <SubmitButton key='login'
                        className='w-full p-button-lg'
                        label='page.login.login' icon={ mdiLogin }/>
        </div>

      </Form>
      <Divider align="center">
        <span className="text-gray-500 text-sm">{i10n('common.lang.or')}</span>
      </Divider>

      <div className='flex justify-center mt-3'>
        <Link to={ `/register?from=${ from }` } className='p-button p-button-info p-button-outlined p-button-lg flex gap-2 items-center w-full justify-center'>
          <Icon path={ mdiAccountPlus } size={ 1 }/>
          { i10n('page.login.register') }
        </Link>
      </div>

    </Card>
  </>
}

const _ = () => {
  const [locale] = useLocalStorage<SupportedLocales>('en', 'language')

  return <PrimeReactProvider value={ { locale: locale } }>
    <div className='flex justify-center h-screen items-center'>
      <LoginCard/>
    </div>
  </PrimeReactProvider>
}

export default _
