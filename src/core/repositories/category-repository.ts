import RestApi from "./rest-api";
import { Category, Identifier, PagedResponse } from "../types";

export type CategoryPage = PagedResponse<Category>

const CategoryRepository = (api => {
    return {
        all: ()                                 => api.get<Category[]>('categories'),
        list: (page: number)                    => api.post<any, CategoryPage>('categories', { page: page }),
        get: (id: Identifier)                   => api.get<Category>(`categories/${id}`),
        update: (id: Identifier, category: any) => api.post<any, Category>(`categories/${id}`, category),
        create: (category: any)                 => api.put<any, Category>('categories', category),
        delete: ({ id }: Category)              => api.delete(`categories/${id}`)
    }
})(RestApi)

export default CategoryRepository