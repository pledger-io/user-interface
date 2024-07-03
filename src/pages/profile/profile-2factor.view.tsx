import { mdiLockOff } from "@mdi/js";
import { useEffect, useState } from "react";
import BreadCrumbItem from "../../components/breadcrumb/breadcrumb-item.component";
import BreadCrumbs from "../../components/breadcrumb/breadcrumb.component";
import { Form, Input, SubmitButton } from "../../components/form";
import { Button } from "../../components/layout/button";
import Card from "../../components/layout/card.component";
import Loading from "../../components/layout/loading.component";
import Translation from "../../components/localization/translation.component";
import NavigationComponent from "../../components/profile/navigation.component";
import Message from "../../components/layout/message.component";
import ProfileRepository from "../../core/repositories/profile.repository";
import RestAPI from "../../core/repositories/rest-api";
import NotificationService from "../../service/notification.service";

const Profile2FactorView = () => {
    const [qrCode, setQrCode] = useState<string>()

    useEffect(() => {
        ProfileRepository.get2Factor()
            .then(r => setQrCode(r as string))
    }, [])

    const currentlyEnabled = (RestAPI.user() as any).mfa

    const onSubmit = (form: any) => {
        ProfileRepository.enableMfa(form.code)
            .then(() => NotificationService.success('page.user.profile.twofactor.enable.success'))
            .then(() => RestAPI.profile())
            .catch(() => NotificationService.warning('page.user.profile.twofactor.enable.error'))
    }
    const onDisable = () => ProfileRepository.disableMfa()
        .then(() => NotificationService.success('page.user.profile.twofactor.disable.success'))
        .then(() => RestAPI.profile())
        .catch(() => NotificationService.warning('page.user.profile.twofactor.disable.failed'))

    return <>
        <BreadCrumbs>
            <BreadCrumbItem label='page.title.user.profile'/>
            <BreadCrumbItem label='page.user.profile.twofactor'/>
        </BreadCrumbs>

        <Card title='page.title.user.profile'>
            <div className='flex gap-4'>
                <div className='w-30'>
                    <NavigationComponent/>
                </div>
                <div className='flex-1'>
                    <h1 className='font-bold text-lg mb-4'><Translation label='page.user.profile.twofactor'/></h1>

                    { !currentlyEnabled && <Form entity='Profile' onSubmit={ onSubmit }>
                        <div className='flex gap-5'>
                            <div>
                                { !qrCode && <Loading/> }
                                { qrCode && <img src={ qrCode } alt='QR code'/> }
                            </div>
                            <div className='flex-1'>
                                <Message label='page.user.profile.twofactor.explained' variant='info'/>
                                <Input.Text id='code'
                                            type='text'
                                            required
                                            title='UserAccount.twofactor.secret'/>

                                <div className='mx-auto w-fit mt-4'>
                                    <SubmitButton label='page.user.profile.action.twofactor.enable'
                                                  className='min-w-[100px]'/>
                                </div>
                            </div>
                        </div>
                    </Form> }

                    { currentlyEnabled && <>
                        <Message label='page.user.profile.twofactor.disableExplain' variant='info'/>

                        <Button label='page.user.profile.action.twofactor.disable'
                                onClick={ onDisable }
                                icon={ mdiLockOff }
                                variant='warning'/>
                    </> }
                </div>
            </div>
        </Card>
    </>
}

export default Profile2FactorView