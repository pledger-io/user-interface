import React from "react";

import {Form, Input, SubmitButton} from '../core/form'
import {Buttons, Card, Dropdown, Message, Translations} from "../core";
import {mdiAccountPlus, mdiLogin, mdiWeb} from "@mdi/js";
import RestAPI from "../core/RestAPI";

import '../assets/css/LoginCard.scss'

export class LoginCard extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.failure = "";
    }

    renderFailure() {
        if (this.failure) {
            return <Message label='page.login.invalid' style='warning'/>
        }
        return '';
    }

    render() {
        return (
            <div className='LoginCard'>
                <span/>
                <Form entity='UserAccount' onSubmit={entity => this.authenticate(entity)}>
                    <Card title='page.login.title'
                          actions={this.getLanguageDropdown()}
                          buttons={[
                              <SubmitButton key='login' label='page.login.login' icon={mdiLogin}/>]}>
                        {this.renderFailure()}
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
                    </Card>
                </Form>
                <span/>
            </div>
        )
    }

    getLanguageDropdown() {
        return [
            <Dropdown.Dropdown icon={mdiWeb} key='language-dropdown'>
                <button className='Button text Flag us'
                        onClick={() => Translations.LocalizationService.load('en')}>English</button>
                <button className='Button text Flag de'
                        onClick={() => Translations.LocalizationService.load('de')}>Deutsch</button>
                <button className='Button text Flag nl'
                        onClick={() => Translations.LocalizationService.load('nl')}>Nederlands</button>
            </Dropdown.Dropdown>
        ]
    }

    authenticate(entity) {
        RestAPI.authenticate(entity.username, entity.password)
            .then(() => document.location.href = '/')
            .catch(exception => this.failure = exception)
    }
}
