import { mdiContentSave } from "@mdi/js";
import React from "react";
import { useRouteLoaderData } from "react-router";
import { Form, Input, SubmitButton } from "../../components/form";
import { i10n } from "../../config/prime-locale";
import { useNotification } from "../../context/notification-context";
import { Themes, useTheme } from "../../context/theme-context";
import ProfileRepository from "../../core/repositories/profile.repository";
import RestAPI from "../../core/repositories/rest-api";
import { RouterAuthentication } from "../../types/router-types";

const ProfileThemeView = () => {
  const authentication: RouterAuthentication | undefined = useRouteLoaderData('authenticated')
  const { success, warning } = useNotification()
  const { setTheme } = useTheme()

  const currentTheme = authentication?.user?.theme
  const onSubmit = (form: any) => {
    ProfileRepository.patch({ theme: form.theme })
      .then(() => success('page.user.profile.theme.success'))
      .then(() => RestAPI.profile().then(profile => setTheme(profile.theme)))
      .catch(() => warning('page.user.profile.theme.error'))
  }

  return <>
    <h1 className='font-bold text-lg mb-4'>{ i10n('page.user.profile.theme') }</h1>

    <Form entity='Profile' onSubmit={ onSubmit }>
      <Input.Radio id='theme'
                   options={ [
                     Themes.dark,
                     Themes.navy,
                     Themes.light
                   ] }
                   value={ currentTheme }/>

      <SubmitButton label='common.action.save'
                    icon={ mdiContentSave }/>
    </Form>
  </>
}

export default ProfileThemeView
