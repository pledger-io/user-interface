import React, { useState } from "react";
import { mdiAccountPlus, mdiLogin, mdiWeb } from "@mdi/js";

import { Form, Input, SubmitButton } from '../components/form'
import { Message } from "../core";
import SecurityRepository from "../core/repositories/security-repository";
import useQueryParam from "../hooks/query-param.hook";
import { useNavigate } from "react-router-dom";
import Card from "../components/layout/card.component";
import LocalizationService from "../service/localization.service";
import { Dropdown } from "../components/layout/dropdown";
import { Button } from "../components/layout/button";

type LoginForm = {
    username: string,
    password: string
}

function Login() {
    const [failure, setFailure] = useState()
    const [from] = useQueryParam({ key: 'from', initialValue: '/dashboard' })
    const navigate = useNavigate()

    const onSubmit = (entity: LoginForm) =>
        SecurityRepository.authenticate(entity.username, entity.password)
            .then(() => navigate(from))
            .catch(setFailure)

    return <div className='flex justify-center h-[100vh] items-center'>
        <Form entity='UserAccount' onSubmit={ onSubmit }>
            <Card title='page.login.title'
                  className='min-w-[30rem]'
                  actions={ [
                      <Dropdown icon={ mdiWeb }
                                         className='[&>div]:bg-white [&>div]:px-4 [&>div]:rounded [&>div]:border-separator [&>div]:border-[1px]'
                                         key='language-dropdown'>
                          <button className='!rounded-t Flag us hover:opacity-80 border-b-[1px]'
                                  type='button'
                                  onClick={ () => LocalizationService.load('en') }>English
                          </button>
                          <button className='Flag de hover:opacity-80 border-b-[1px]'
                                  type='button'
                                  onClick={ () => LocalizationService.load('de') }>Deutsch
                          </button>
                          <button className='Flag nl !pl-5 !rounded-b hover:opacity-80'
                                  type='button'
                                  onClick={ () => LocalizationService.load('nl') }>Nederlands
                          </button>
                      </Dropdown>] }
                  buttons={ [
                      <SubmitButton key='login' label='page.login.login' icon={ mdiLogin }/>] }>

                { failure && <Message label='page.login.invalid' variant='warning'/> }

                <div className='form'>
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
                </div>

                <div className='flex justify-end'>
                    <Button
                        href={ `/register?from=${ from }` }
                        icon={ mdiAccountPlus }
                        label='page.login.register'
                        variant='text'/>
                </div>
            </Card>
        </Form>
    </div>
}

export default Login
