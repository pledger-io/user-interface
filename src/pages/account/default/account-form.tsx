import { useRouteLoaderData } from "react-router";
import Loading from "../../../components/layout/loading.component";
import ActualForm from "../account-form"

const AccountForm = () => {
    const type = useRouteLoaderData('other-accounts')

    if (!type) return <Loading/>
    return <ActualForm type={ type as string }/>
}

export default AccountForm