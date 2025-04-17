import { Card } from "primereact/card";
import { Message } from "primereact/message";
import React from "react";
import { useRouteLoaderData } from "react-router";
import BreadCrumbItem from "../../components/breadcrumb/breadcrumb-item.component";
import BreadCrumbs from "../../components/breadcrumb/breadcrumb.component";
import { Form, Input, SubmitButton } from "../../components/form";
import { i10n } from "../../config/prime-locale";
import { useNotification } from "../../context/notification-context";
import RestAPI from "../../core/repositories/rest-api";
import { mdiContentSave } from "@mdi/js";
import ProfileRepository from "../../core/repositories/profile.repository";
import NavigationComponent from "../../components/profile/navigation.component";
import { RouterAuthentication } from "../../types/router-types";

const ProfileThemeView = () => {
  const authentication: RouterAuthentication | undefined = useRouteLoaderData('authentication')
  const { success, warning } = useNotification()

  const currentTheme = authentication?.user?.theme
  const onSubmit = (form: any) => {
    ProfileRepository.patch({ theme: form.theme })
      .then(() => success('page.user.profile.theme.success'))
      .then(() => RestAPI.profile())
      .catch(() => warning('page.user.profile.theme.error'))
  }

  return <>
    <BreadCrumbs>
      <BreadCrumbItem label='page.title.user.profile'/>
      <BreadCrumbItem label='page.user.profile.theme'/>
    </BreadCrumbs>

    <Card title='page.title.user.profile'>
      <div className='flex gap-4'>
        <div className='w-30'>
          <NavigationComponent/>
        </div>
        <div className='flex-1'>
          <h1 className='font-bold text-lg'>{ i10n('page.user.profile.theme') }</h1>

          <Message text={ i10n('page.user.theme.explain') } severity='info'/>

          <Form entity='Profile' onSubmit={ onSubmit }>
            <Input.Radio id='theme'
                         options={ [
                           { value: 'dark', message: 'Dark' },
                           { value: 'navy', message: 'Navy' },
                           { value: 'light', message: 'Light' }
                         ] }
                         value={ currentTheme }/>

            <SubmitButton label='common.action.save'
                          icon={ mdiContentSave }/>
          </Form>
        </div>
      </div>
    </Card>
  </>
}

export default ProfileThemeView
