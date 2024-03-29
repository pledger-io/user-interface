import { Route } from "react-router-dom";
import { CurrencyOverview } from "./currency/CurrencyOverview";
import { CurrencyForm } from "./currency/CurrencyForm";
import { SettingOverviewComponent } from "./SettingOverview";

export const SettingRoutes = [
    <Route key='currency-overview' path='/settings/currencies' element={<CurrencyOverview />}/>,
    <Route key='currency-edit' path='/settings/currencies/:code/edit' element={<CurrencyForm />}/>,
    <Route key='currency-add' path='/settings/currencies/add' element={<CurrencyForm />}/>,

    <Route key='setting-overview' path='/settings' element={<SettingOverviewComponent />}/>,
]
