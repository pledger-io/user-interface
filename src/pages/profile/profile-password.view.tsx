import React from "react";
import { Form, Input, SubmitButton } from "../../components/form";
import Message from "../../components/layout/message.component";
import Translation from "../../components/localization/translation.component";
import ProfileRepository from "../../core/repositories/profile.repository";
import NotificationService from "../../service/notification.service";

const ProfilePasswordView = () => {
  const onSubmit = (form: any) => {
    ProfileRepository.patch({ password: form.password })
      .then(() => NotificationService.success('page.user.password.changed.success'))
      .catch(() => NotificationService.warning('page.user.password.changed.failed'))
  }

  return <>
    <h1 className='font-bold text-lg'><Translation label='page.header.user.password'/></h1>

    <Message label='page.user.password.change.explain' variant='info'/>

    <Form entity='Profile' onSubmit={ onSubmit }>
      <div className='max-w-[30em] mx-auto'>
        <Input.Password id='password' title='UserAccount.password' required/>
        <SubmitButton label='page.header.user.password'/>
      </div>
    </Form>
  </>
}

export default ProfilePasswordView
