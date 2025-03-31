import { mdiLockOff } from "@mdi/js";
import { Message } from "primereact/message";
import { useEffect, useState } from "react";
import { Form, Input, SubmitButton } from "../../components/form";
import { Button } from "../../components/layout/button";
import Loading from "../../components/layout/loading.component";
import Translation from "../../components/localization/translation.component";
import { i10n } from "../../config/prime-locale";
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
    <h1 className='font-bold text-lg mb-4'>{ i10n('page.user.profile.twofactor') }</h1>

    { !currentlyEnabled && <Form entity='Profile' onSubmit={ onSubmit }>
      <div className='flex gap-5'>
        <div className='w-50'>
          { !qrCode && <Loading/> }
          { qrCode && <img src={ qrCode } alt='QR code' className='w-full aspect-square'/> }
        </div>
        <div className='flex-1'>
          <Message text={ i10n('page.user.profile.twofactor.explained') } severity='info'/>
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
      <Message text={ i10n('page.user.profile.twofactor.disableExplain') } severity='info'/>

      <Button label='page.user.profile.action.twofactor.disable'
              onClick={ onDisable }
              icon={ mdiLockOff }
              severity='warning'/>
    </> }
  </>
}

export default Profile2FactorView
