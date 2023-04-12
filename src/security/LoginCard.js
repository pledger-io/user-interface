import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {mdiAccountPlus, mdiLogin, mdiWeb} from "@mdi/js";

import {Form, Input, SubmitButton} from '../core/form'
import {Buttons, Dropdown, Layout, Message, Translations} from "../core";
import {SecurityRepository} from "../core/RestAPI";

import '../assets/css/LoginCard.scss'
import PropTypes from "prop-types";

const LoginCard = ({callback}) => {
    const [failure, setFailure] = useState()
    const navigate              = useNavigate()

    const onSubmit = entity => SecurityRepository.authenticate(entity.username, entity.password)
        .then(() => callback())
        .then(() => navigate('/dashboard'))
        .catch(setFailure)

    return (
        <div className='LoginCard'>
            <span/>
            <Form entity='UserAccount' onSubmit={onSubmit}>
                <Layout.Card title='page.login.title'
                      actions={[
                          <Dropdown.Dropdown icon={mdiWeb} key='language-dropdown'>
                              <button className='Button text Flag us'
                                      onClick={() => Translations.LocalizationService.load('en')}>English</button>
                              <button className='Button text Flag de'
                                      onClick={() => Translations.LocalizationService.load('de')}>Deutsch</button>
                              <button className='Button text Flag nl'
                                      onClick={() => Translations.LocalizationService.load('nl')}>Nederlands</button>
                          </Dropdown.Dropdown>]}
                      buttons={[
                          <SubmitButton key='login' label='page.login.login' icon={mdiLogin}/>]}>
                    {failure && <Message label='page.login.invalid' variant='warning'/>}
                    <div className='form'>
                        <Input.Text id='username'
                                    title='UserAccount.username'
                                    type='text'
                                    required/>
                        <Input.Text id='password'
                                    title='UserAccount.password'
                                    type='password'
                                    required/>
                    </div>

                    <div className='register'>
                        <Buttons.Button
                            href='/register'
                            icon={mdiAccountPlus}
                            label='page.login.register'
                            variant='text'/>
                    </div>
                </Layout.Card>
            </Form>
            <span/>
        </div>
    )
}
LoginCard.propTypes = {
    callback: PropTypes.func
}

export default LoginCard
