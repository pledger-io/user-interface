import RulesOverview from "./overview/rules.overview";
import {Route} from "react-router-dom";
import React from "react";
import EditPage from "./edit-page/edit-page";

export const RulesRoutes = [
    <Route key='listing' path='/automation/schedule/rules' element={ <RulesOverview/> }/>,

    <Route key='edit' path='/automation/schedule/rules/:group/:id/edit' element={ <EditPage /> }/>,
    <Route key='new' path='/automation/schedule/rules/:group/create' element={ <EditPage /> }/>,
]