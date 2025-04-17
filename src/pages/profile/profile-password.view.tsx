import { Message } from "primereact/message";
import React from "react";
import { Form, Input, SubmitButton } from "../../components/form";
import { i10n } from "../../config/prime-locale";
import { useNotification } from "../../context/notification-context";
import ProfileRepository from "../../core/repositories/profile.repository";

const ProfilePasswordView = () => {
  const { success, warning } = useNotification()

  const onSubmit = (form: any) => {
    ProfileRepository.patch({ password: form.password })
      .then(() => success('page.user.password.changed.success'))
      .catch(() => warning('page.user.password.changed.failed'))
  }

  return <>
    <h1 className='font-bold text-lg'>{ i10n('page.header.user.password') }</h1>

    <Message text={ i10n('page.user.password.change.explain') } severity='info'/>

    <Form entity='Profile' onSubmit={ onSubmit }>
      <div className='max-w-[30em] mx-auto'>
        <Input.Password id='password' title='UserAccount.password' required/>
        <SubmitButton label='page.header.user.password'/>
      </div>
    </Form>
  </>
}

export default ProfilePasswordView
