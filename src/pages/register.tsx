import React, { useState } from "react";

import { Form, Input, SubmitButton } from "../components/form";
import Message from "../components/layout/message.component";
import { mdiAccountPlus, mdiLogin } from "@mdi/js";
import { useNavigate } from "react-router";
import SecurityRepository from "../core/repositories/security-repository";

import '../assets/css/RegisterCard.scss'
import useQueryParam from "../hooks/query-param.hook";

import Card from "../components/layout/card.component";
import Button from "../components/layout/button/button.component";

type LoginForm = {
    username: string,
    password: string
}

const Register = () => {
    const [exception, setException] = useState()
    const navigate = useNavigate()
    const [from] = useQueryParam({ key: 'from', initialValue: '/dashboard' })


    const onSubmit = ({ username, password }: LoginForm) => SecurityRepository.register(username, password)
        .then(() => navigate('/login?from=' + from))
        .catch(setException)

    return (
        <div className="RegisterCard">
            <span/>
            <Form onSubmit={onSubmit}
                  entity='UserAccount'>
                <Card title='page.title.register'
                             buttons={[
                                 <SubmitButton key='login'
                                               label='page.register.register'
                                               icon={mdiAccountPlus}/>]}>
                    {exception && <Message label='page.login.invalid' variant='warning'/>}
                    <div className='form'>
                        <Input.Text id='username'
                                    title='UserAccount.username'
                                    autocomplete='username'
                                    type='text'
                                    required/>
                        <Input.Password id='password'/>
                    </div>

                    <div className='login'>
                        <Button
                            href={`/login?from=${from}`}
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

export default Register
