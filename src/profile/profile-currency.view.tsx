import {Layout, Notifications, Translations} from "../core";
import NavigationComponent from "./navigation.component";
import {Form, Input, SubmitButton} from "../core/form";
import RestAPI from "../core/repositories/rest-api";
import {mdiContentSave} from "@mdi/js";
import ProfileRepository from "../core/repositories/profile.repository";
import {Currency} from "../core/types";
import {useEffect, useState} from "react";
import {CurrencyRepository} from "../core/RestAPI";

const ProfileCurrencyView = () => {
    const [currencies, setCurrencies] = useState<Currency[]>()

    useEffect(() => {
        CurrencyRepository.list()
            .then(setCurrencies)
            .then(() => RestAPI.profile())
            .catch(() => Notifications.Service.warning('page.user.profile.currency.error'))
    }, [])

    const current = (RestAPI.user() as any).currency
    const onSubmit = (form: any) => {
        ProfileRepository.patch({currency: form.currency})
            .then(() => Notifications.Service.success('page.user.profile.currency.success'))
            .catch(() => Notifications.Service.warning('page.user.profile.currency.error'))
    }

    if (!currencies) return <Layout.Loading />
    return <>
        <Layout.Card title='page.title.user.profile'>
            <div className='flex gap-4'>
                <div className='w-30'>
                    <NavigationComponent />
                </div>
                <div className='flex-1'>
                    <h1 className='font-bold text-lg'><Translations.Translation label='page.user.profile.currency' /></h1>

                    <Form entity='Profile' onSubmit={ onSubmit }>
                        <Input.Radio id='currency'
                                     options={ currencies.map(c => ({value: c.code, message: c.name})) }
                                    value={ current } />

                        <SubmitButton label='common.action.save'
                                      icon={ mdiContentSave } />
                    </Form>
                </div>
            </div>
        </Layout.Card>
    </>
}

export default ProfileCurrencyView