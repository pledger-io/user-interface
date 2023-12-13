import { Layout, Message, Notifications, Translations } from "../core";
import NavigationComponent from "./navigation.component";
import { Form, Input, SubmitButton } from "../core/form";
import ProfileRepository from "../core/repositories/profile.repository";

const ProfilePasswordView = () => {
    const onSubmit = (form: any) => {
        ProfileRepository.patch({ password: form.password })
            .then(() => Notifications.Service.success('page.user.password.changed.success'))
            .catch(() => Notifications.Service.warning('page.user.password.changed.failed'))
    }

    return <>
        <Layout.Card title='page.title.user.profile'>
            <div className='flex gap-4'>
                <div className='w-30'>
                    <NavigationComponent />
                </div>
                <div className='flex-1'>
                    <h1 className='font-bold text-lg'><Translations.Translation label='page.header.user.password' /></h1>

                    <Message label='page.user.password.change.explain' variant='info' />

                    <Form entity='Profile' onSubmit={ onSubmit }>
                        <div className='max-w-[30em]'>
                            <Input.Password id='password' required />
                            <SubmitButton label='page.header.user.password' />
                        </div>
                    </Form>
                </div>
            </div>
        </Layout.Card>
    </>
}

export default ProfilePasswordView