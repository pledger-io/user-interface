import { Form, Input, SubmitButton } from "../core/form";
import { Message, Notifications } from "../core";
import { mdiCheck } from "@mdi/js";
import SecurityRepository from "../core/repositories/security-repository";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { useQueryParam } from "../core/hooks";

import Card from "../components/layout/card.component";

const TwoFactor = () => {
    const navigate = useNavigate();
    const [ from ] = useQueryParam({ key: 'from', initialValue:'/dashboard' })
    const onSubmit = (entity: any) => {
        SecurityRepository.twoFactor(entity.code)
            .then(() => navigate(from))
            .catch((error: AxiosError) => Notifications.Service.exception(error))
    }

    return <>
        <div className='flex justify-center h-[100vh] items-center'>
            <Form entity='UserAccount' onSubmit={ onSubmit }>
                <Card title='page.login.verify.title'
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

                </Card>
            </Form>
        </div>
    </>
}

export default TwoFactor;