import RestApi from "./rest-api";
import { Category, Identifier, PagedResponse } from "../../types/types";

export type CategoryPage = PagedResponse<Category>

const CategoryRepository = (api => {
  return {
    all: () => api.get<CategoryPage>('categories?offset=0&numberOfResults=99999').then(results => results.content || []),
    list: (page: number) => api.get<CategoryPage>(`categories?offset=${(page - 1) * 25}&numberOfResults=25`, { page: page }),
    get: (id: Identifier) => api.get<Category>(`categories/${ id }`),
    update: (id: Identifier, category: any) => api.put<any, Category>(`categories/${ id }`, category),
    create: (category: any) => api.post<any, Category>('categories', category),
    delete: ({ id }: Category) => api.delete(`categories/${ id }`)
  }
})(RestApi)

export default CategoryRepository