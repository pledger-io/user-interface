import React from "react";
import {Route} from "react-router-dom";
import {CategoryOverview} from "./CategoryOverview";
import {CategoryForm} from "./CategoryForm";

export const CategoryRoutes = [
    <Route key='category-overview' path='/categories' element={<CategoryOverview/>}/>,
    <Route key='category-form' path='/categories/:id/edit' element={<CategoryForm />}/>,
    <Route key='category-form' path='/categories/add' element={<CategoryForm />}/>
]
