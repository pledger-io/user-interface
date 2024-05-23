import { Form, Input, SubmitButton } from "../core/form";
import { Layout, Message, Notifications } from "../core";
import { mdiCheck } from "@mdi/js";
import SecurityRepository from "../core/repositories/security-repository";
import { AxiosError } from "axios";

const TwoFactorCard = ({ callback }: { callback: () => void }) => {
    const onSubmit = (entity: any) => {
        SecurityRepository.twoFactor(entity.code)
            .then(callback)
            .catch((error: AxiosError) => Notifications.Service.exception(error))
    }

    return <>
        <div className='flex justify-center h-[100vh] items-center'>
            <Form entity='UserAccount' onSubmit={ onSubmit }>
                <Layout.Card title='page.login.verify.title'
                             buttons={[
                                 <SubmitButton key='verify'
                                               label='page.login.verify.action'
                                               icon={ mdiCheck }/>
                             ]}
                             className='min-w-[30rem]'>

                    <Message label='page.login.verify.explain' variant='info' />

                    <Input.Text id='code'
                                title='UserAccount.twofactor.secret'
                                type='text'
                                pattern="^[0-9]{6}$"
                                required />

                </Layout.Card>
            </Form>
        </div>
    </>
}

export default TwoFactorCard;