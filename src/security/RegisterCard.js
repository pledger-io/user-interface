import React, {useState} from "react";

import {Form, Input, SubmitButton} from "../core/form";
import {Buttons, Layout, Message} from "../core";
import {mdiAccountPlus, mdiLogin} from "@mdi/js";

import '../assets/css/RegisterCard.scss'
import {SecurityRepository} from "../core/RestAPI";
import {useNavigate} from "react-router-dom";

const RegisterCard = () => {
    const [exception, setException] = useState()
    const navigate                  = useNavigate()

    const onSubmit = ({username, password}) => SecurityRepository.register(username, password)
        .then(() => navigate('/login'))
        .catch(setException)

    return (
        <div className="RegisterCard">
            <span/>
            <Form onSubmit={onSubmit}
                  entity='UserAccount'>
                <Layout.Card title='page.title.register'
                      buttons={[
                          <SubmitButton key='login'
                                        label='page.register.register'
                                        icon={mdiAccountPlus}/>]}>
                    { exception && <Message label='page.login.invalid' variant='warning'/> }
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
                </Layout.Card>
            </Form>
            <span/>
        </div>
    )
}

export default RegisterCard
