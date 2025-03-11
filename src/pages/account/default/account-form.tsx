import { useRouteLoaderData } from "react-router";
import Loading from "../../../components/layout/loading.component";
import { ROUTER_ACCOUNT_TYPE_KEY, RouterAccountType } from "../../../types/router-types";
import ActualForm from "../account-form"

const AccountForm = () => {
    const type: RouterAccountType = useRouteLoaderData(ROUTER_ACCOUNT_TYPE_KEY)

    if (!type) return <Loading/>
    return <ActualForm type={ type as string }/>
}

export default AccountForm
