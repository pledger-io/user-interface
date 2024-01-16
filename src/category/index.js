import React from "react";
import { Route } from "react-router-dom";
import { CategoryForm } from "./CategoryForm";
import CategoryListing from "./listing";

export const CategoryRoutes = [
    <Route key='category-overview' path='/categories' element={<CategoryListing />}/>,
    <Route key='category-form' path='/categories/:id/edit' element={<CategoryForm />}/>,
    <Route key='category-form' path='/categories/add' element={<CategoryForm />}/>
]
