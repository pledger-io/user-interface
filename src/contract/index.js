import { Route } from "react-router-dom";
import ContractOverview from "./overview";
import ContractEdit from "./edit";
import ContractDetail from "./detail";

export const ContractRoutes = [
    <Route key='contract-overview' path='/contracts' element={<ContractOverview />} />,
    <Route key='contract-create' path='/contracts/create' element={<ContractEdit />} />,
    <Route key='contract-edit' path='/contracts/:id/edit' element={<ContractEdit />} />,
    <Route key='contract-detail' path='/contracts/:id' element={<ContractDetail />} />
]
