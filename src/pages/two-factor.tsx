import { Form, Input, SubmitButton } from "../components/form";
import { mdiCheck } from "@mdi/js";
import Message from "../components/layout/message.component";
import SecurityRepository from "../core/repositories/security-repository";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import useQueryParam from "../hooks/query-param.hook";

import Card from "../components/layout/card.component";
import NotificationService from "../service/notification.service";

const TwoFactor = () => {
    const navigate = useNavigate();
    const [ from ] = useQueryParam({ key: 'from', initialValue:'/dashboard' })
    const onSubmit = (entity: any) => {
        SecurityRepository.twoFactor(entity.code)
            .then(() => navigate(from))
            .catch((error: AxiosError) => NotificationService.exception(error))
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