import RestApi from "./rest-api";

const CategoryRepository = (api => {
    return {
        all: () => api.get('categories'),
        list: page => api.post('categories', {page: page}),
        get: id => api.get(`categories/${id}`),
        update: (id, category) => api.post(`categories/${id}`, category),
        create: category => api.put('categories', category),
        delete: ({id}) => api.delete(`categories/${id}`)
    }
})(RestApi)

export default CategoryRepository