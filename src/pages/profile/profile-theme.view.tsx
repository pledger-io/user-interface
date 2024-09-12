import BreadCrumbItem from "../../components/breadcrumb/breadcrumb-item.component";
import BreadCrumbs from "../../components/breadcrumb/breadcrumb.component";
import Translation from "../../components/localization/translation.component";
import Message from "../../components/layout/message.component";
import { Form, Input, SubmitButton } from "../../components/form";
import RestAPI from "../../core/repositories/rest-api";
import { mdiContentSave } from "@mdi/js";
import ProfileRepository from "../../core/repositories/profile.repository";

import NavigationComponent from "../../components/profile/navigation.component";
import Card from "../../components/layout/card.component";
import NotificationService from "../../service/notification.service";

const ProfileThemeView = () => {

    const currentTheme = (RestAPI.user() as any).theme
    const onSubmit = (form: any) => {
        ProfileRepository.patch({ theme: form.theme })
            .then(() => NotificationService.success('page.user.profile.theme.success'))
            .then(() => RestAPI.profile())
            .catch(() => NotificationService.warning('page.user.profile.theme.error'))
    }

    return <>
        <BreadCrumbs>
            <BreadCrumbItem label='page.title.user.profile' />
            <BreadCrumbItem label='page.user.profile.theme' />
        </BreadCrumbs>

        <Card title='page.title.user.profile'>
            <div className='flex gap-4'>
                <div className='w-30'>
                    <NavigationComponent />
                </div>
                <div className='flex-1'>
                    <h1 className='font-bold text-lg'><Translation label='page.user.profile.theme' /></h1>

                    <Message label='page.user.profile.theme.explain' variant='info' />

                    <Form entity='Profile' onSubmit={ onSubmit }>
                        <Input.Radio id='theme'
                                     options={[
                                         { value: 'dark', message: 'Dark' },
                                         { value: 'navy', message: 'Navy' },
                                         { value: 'light', message: 'Light' }
                                     ]}
                                    value={ currentTheme } />

                        <SubmitButton label='common.action.save'
                                      icon={ mdiContentSave } />
                    </Form>
                </div>
            </div>
        </Card>
    </>
}

export default ProfileThemeView