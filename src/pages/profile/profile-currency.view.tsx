import BreadCrumbItem from "../../components/breadcrumb/breadcrumb-item.component";
import BreadCrumbs from "../../components/breadcrumb/breadcrumb.component";
import Translation from "../../components/localization/translation.component";
import NavigationComponent from "../../components/profile/navigation.component";
import { Form, Input, SubmitButton } from "../../components/form";
import RestAPI from "../../core/repositories/rest-api";
import { mdiContentSave } from "@mdi/js";
import ProfileRepository from "../../core/repositories/profile.repository";
import { Currency } from "../../core/types";
import { useEffect, useState } from "react";
import { CurrencyRepository } from "../../core/RestAPI";

import Card from "../../components/layout/card.component";
import Loading from "../../components/layout/loading.component";
import NotificationService from "../../service/notification.service";

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
        <BreadCrumbs>
            <BreadCrumbItem label='page.title.user.profile' />
            <BreadCrumbItem label='page.user.profile.currency' />
        </BreadCrumbs>

        <Card title='page.title.user.profile'>
            <div className='flex gap-4'>
                <div className='w-30'>
                    <NavigationComponent />
                </div>
                <div className='flex-1'>
                    <h1 className='font-bold text-lg'><Translation label='page.user.profile.currency' /></h1>

                    { !currencies && <Loading /> }
                    { currencies && <Form entity='Profile' onSubmit={ onSubmit }>
                        <Input.Radio id='currency'
                                     options={ currencies.map(c => ({ value: c.code, message: c.name })) }
                                    value={ current } />

                        <SubmitButton label='common.action.save'
                                      icon={ mdiContentSave } />
                    </Form> }
                </div>
            </div>
        </Card>
    </>
}

export default ProfileCurrencyView