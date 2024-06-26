import React, { useEffect, useState } from "react";
import { useQueryParam } from "../../core/hooks";
import CategoryRepository from "../../core/repositories/category-repository";
import { Category, Pagination } from "../../core/types";
import { BreadCrumbItem, BreadCrumbs, Buttons, Translations } from "../../core";
import { mdiPlus } from "@mdi/js";
import CategoryRow from "../../components/category/category-row.component";
import { Paginator } from "../../core/Paginator";
import Card from "../../components/layout/card.component";
import Loading from "../../components/layout/loading.component";

const CategoryListing = () => {
    const [categories, setCategories] = useState<Category[]>()
    const [page] = useQueryParam({ key: 'page', initialValue: "1" })
    const [pagination, setPagination] = useState<Pagination>()

    const load = React.useCallback(() => {
        setCategories(undefined)
        CategoryRepository.list(parseInt(page))
            .then(response => {
                setCategories(response.content)
                setPagination(response.info)
            })
    }, [page])

    useEffect(() => {
        load()
    }, [load])

    const isLoaded = categories
    const hasContent = isLoaded && categories.length > 0
    return <>
        <div className="CategoryOverview">
            <BreadCrumbs>
                <BreadCrumbItem label='page.nav.settings'/>
                <BreadCrumbItem label='page.nav.settings.categories'/>
            </BreadCrumbs>

            <Card title='page.nav.settings.categories' actions={ [
                <Buttons.Button label='page.settings.categories.add' variant='primary' icon={ mdiPlus } href='./add'
                                key='add'/>
            ] }>
                <table className='Table'>
                    <thead>
                    <tr>
                        <th className='w-[60px]'/>
                        <th><Translations.Translation label='Category.label'/></th>
                        <th><Translations.Translation label='Category.description'/></th>
                        <th><Translations.Translation label='Category.lastActivity'/></th>
                    </tr>
                    </thead>
                    <tbody>
                    { !isLoaded && <tr>
                        <td colSpan={ 4 } className='text-center'>
                            <Loading/>
                        </td>
                    </tr> }
                    { hasContent && categories.map(c =>
                        <CategoryRow deleteCallback={ load }
                                     category={ c }
                                     key={ c.id }/>) }
                    { isLoaded && !hasContent &&
                        <tr>
                            <td colSpan={ 4 } className='text-center text-gray-500'>
                                <Translations.Translation label='common.overview.noresults'/>
                            </td>
                        </tr> }
                    </tbody>
                </table>

                { hasContent && <Paginator page={ parseInt(page) }
                                           records={ pagination?.records }
                                           pageSize={ pagination?.pageSize }/> }
            </Card>
        </div>
    </>
}

export default CategoryListing