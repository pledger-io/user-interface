import React from "react";
import {Route} from "react-router-dom";
import {withPathParams, withQueryContext} from "../core/hooks";
import {CategoryOverview} from "./CategoryOverview";
import {CategoryForm} from "./CategoryForm";

const OverviewWithParams = withQueryContext(CategoryOverview)
const CategoryFormWithPathParams = withPathParams(CategoryForm)
const CategoryAddWithPathParams = withPathParams(CategoryForm)

export const CategoryRoutes = [
    <Route key='category-overview' path='/categories' element={<OverviewWithParams/>}/>,
    <Route key='category-form' path='/categories/:id/edit' element={<CategoryFormWithPathParams />}/>,
    <Route key='category-form' path='/categories/add' element={<CategoryAddWithPathParams />}/>
]
