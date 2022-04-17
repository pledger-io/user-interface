import React from "react";

import {Form, Input, SubmitButton} from "../core/form";
import {Buttons, Card, Message, When} from "../core";
import {mdiAccountPlus, mdiLogin} from "@mdi/js";
import restAPI from "../core/RestAPI";

import '../assets/css/RegisterCard.scss'

class RegisterService {
    register(username, password) {
        return restAPI.put(`security/create-account`, {
            username, password
        })
    }
}
const service = new RegisterService()

export default class RegisterCard extends React.Component {
    state = {
        exception: null
    }

    render() {
        const {exception} = this.state

        return (
            <div className="RegisterCard">
                <span/>
                <Form onSubmit={this.register.bind(this)}
                            entity='UserAccount'>
                    <Card title='page.title.register'
                          buttons={[
                              <SubmitButton key='login'
                                                  label='page.register.register'
                                                  icon={mdiAccountPlus}/>]}>
                        <When condition={exception !== null}>
                            <Message label='page.login.invalid' style='warning'/>
                        </When>
                        <div className='form'>
                            <Input.Text id='username'
                                         title='UserAccount.username'
                                         type='text'
                                         required/>
                            <Input.Password />
                        </div>

                        <div className='login'>
                            <Buttons.Button
                                href='/login'
                                icon={mdiLogin}
                                label='page.register.login'
                                variant='text'/>
                        </div>
                    </Card>
                </Form>
                <span/>
            </div>
        )
    }

    register(entity) {
        service.register(entity.username, entity.password)
            .then(() => document.location.href = '/')
            .catch(exception => this.setState({
                exception: exception
            }))
    }
}
