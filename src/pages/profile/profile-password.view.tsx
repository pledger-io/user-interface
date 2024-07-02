import BreadCrumbItem from "../../components/breadcrumb/breadcrumb-item.component";
import BreadCrumbs from "../../components/breadcrumb/breadcrumb.component";
import Translation from "../../components/localization/translation.component";
import Message from "../../components/layout/message.component";
import NavigationComponent from "../../components/profile/navigation.component";
import { Form, Input, SubmitButton } from "../../components/form";
import ProfileRepository from "../../core/repositories/profile.repository";

import Card from "../../components/layout/card.component";
import NotificationService from "../../service/notification.service";

const ProfilePasswordView = () => {
    const onSubmit = (form: any) => {
        ProfileRepository.patch({ password: form.password })
            .then(() => NotificationService.success('page.user.password.changed.success'))
            .catch(() => NotificationService.warning('page.user.password.changed.failed'))
    }

    return <>
        <BreadCrumbs>
            <BreadCrumbItem label='page.title.user.profile' />
            <BreadCrumbItem label='page.header.user.password'/>
        </BreadCrumbs>

        <Card title='page.title.user.profile'>
            <div className='flex gap-4'>
                <div className='w-30'>
                    <NavigationComponent />
                </div>
                <div className='flex-1'>
                    <h1 className='font-bold text-lg'><Translation label='page.header.user.password' /></h1>

                    <Message label='page.user.password.change.explain' variant='info' />

                    <Form entity='Profile' onSubmit={ onSubmit }>
                        <div className='max-w-[30em]'>
                            <Input.Password id='password' required />
                            <SubmitButton label='page.header.user.password' />
                        </div>
                    </Form>
                </div>
            </div>
        </Card>
    </>
}

export default ProfilePasswordView