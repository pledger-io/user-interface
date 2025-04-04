import { mdiContentSave } from "@mdi/js";
import React, { useEffect, useState } from "react";
import { Form, Input, SubmitButton } from "../../components/form";
import Loading from "../../components/layout/loading.component";
import Translation from "../../components/localization/translation.component";
import ProfileRepository from "../../core/repositories/profile.repository";
import RestAPI from "../../core/repositories/rest-api";
import { CurrencyRepository } from "../../core/RestAPI";
import NotificationService from "../../service/notification.service";
import { Currency } from "../../types/types";

const ProfileCurrencyView = () => {
  const [currencies, setCurrencies] = useState<Currency[]>()

  useEffect(() => {
    CurrencyRepository.list()
      .then(setCurrencies)
      .then(() => RestAPI.profile())
      .catch(() => NotificationService.warning('page.user.profile.currency.error'))
  }, [])

  const current = (RestAPI.user() as any).currency
  const onSubmit = (form: any) => {
    ProfileRepository.patch({ currency: form.currency })
      .then(() => NotificationService.success('page.user.profile.currency.success'))
      .catch(() => NotificationService.warning('page.user.profile.currency.error'))
  }

  return <>
    <h1 className='font-bold text-lg'><Translation label='page.user.profile.currency'/></h1>

    { !currencies && <Loading/> }
    { currencies && <Form entity='Profile' onSubmit={ onSubmit }>
      <Input.Radio id='currency'
                   options={ currencies.map(c => ({ value: c.code, message: c.name })) }
                   value={ current }/>

      <SubmitButton label='common.action.save'
                    icon={ mdiContentSave }/>
    </Form> }
  </>
}

export default ProfileCurrencyView
