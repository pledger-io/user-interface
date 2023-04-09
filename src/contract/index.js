import {Route} from "react-router-dom";
import {ContractOverview} from "./ContractOverview";

export const ContractRoutes = [
    <Route key='contract-overview' path='/contracts' element={<ContractOverview />} />
]
