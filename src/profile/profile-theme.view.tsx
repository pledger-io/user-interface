import { Layout, Message, Notifications, Translations } from "../core";
import NavigationComponent from "./navigation.component";
import { Form, Input, SubmitButton } from "../core/form";
import RestAPI from "../core/repositories/rest-api";
import { mdiContentSave } from "@mdi/js";
import ProfileRepository from "../core/repositories/profile.repository";

const ProfileThemeView = () => {

    const currentTheme = (RestAPI.user() as any).theme
    const onSubmit = (form: any) => {
        ProfileRepository.patch({ theme: form.theme })
            .then(() => Notifications.Service.success('page.user.profile.theme.success'))
            .then(() => RestAPI.profile())
            .catch(() => Notifications.Service.warning('page.user.profile.theme.error'))
    }

    return <>
        <Layout.Card title='page.title.user.profile'>
            <div className='flex gap-4'>
                <div className='w-30'>
                    <NavigationComponent />
                </div>
                <div className='flex-1'>
                    <h1 className='font-bold text-lg'><Translations.Translation label='page.user.profile.theme' /></h1>

                    <Message label='page.user.profile.theme.explain' variant='info' />

                    <Form entity='Profile' onSubmit={ onSubmit }>
                        <Input.Radio id='theme'
                                     options={[
                                         { value: 'dark', message: 'Dark' },
                                         { value: 'navy', message: 'Navy' }
                                     ]}
                                    value={ currentTheme } />

                        <SubmitButton label='common.action.save'
                                      icon={ mdiContentSave } />
                    </Form>
                </div>
            </div>
        </Layout.Card>
    </>
}

export default ProfileThemeView