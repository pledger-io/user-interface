import { mdiCheck } from "@mdi/js";
import { Card } from "primereact/card";
import { Message } from "primereact/message";
import React from "react";
import { useNavigate } from "react-router";
import { Form, Input, SubmitButton } from "../components/form";
import { i10n } from "../config/prime-locale";
import { NotificationProvider, useNotification } from "../context/notification-context";
import SecurityRepository from "../core/repositories/security-repository";
import useQueryParam from "../hooks/query-param.hook";

const TwoFactor = () => {
  const navigate = useNavigate();
  const { httpError } = useNotification();
  const [from] = useQueryParam({ key: 'from', initialValue: '/dashboard' })
  const onSubmit = (entity: any) => {
    SecurityRepository.twoFactor(entity.code)
      .then(() => navigate(from))
      .catch(httpError)
  }

  const header = () => <div className='px-2 py-2 border-b-1 text-center font-bold'>
    { i10n('page.login.verify.title') }
  </div>
  return <>
    <Card header={ header }
          className='md:w-[24rem] shadow-2xl'>
      <Form entity='UserAccount' onSubmit={ onSubmit }>
        <Message text={ i10n('page.login.verify.explain') } severity='info'/>

        <div className='flex justify-center'>
          <Input.Otp id='code'
                      title='UserAccount.twofactor.secret'
                      required/>
        </div>

        <div className='flex pt-3 items-stretch'>
          <SubmitButton key='login'
                        className='w-full p-button-lg'
                        label='page.login.verify.action' icon={ mdiCheck }/>
        </div>
      </Form>
    </Card>
  </>
}

const _ = () => {
  return <NotificationProvider>
    <div className='flex justify-center h-screen items-center'>
      <TwoFactor/>
    </div>
  </NotificationProvider>
}

export default _;
