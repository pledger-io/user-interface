import React, { useEffect, useState } from "react";
import useQueryParam from "../../hooks/query-param.hook";
import CategoryRepository from "../../core/repositories/category-repository";
import { Category, Pagination } from "../../core/types";
import { mdiPlus } from "@mdi/js";
import CategoryRow from "../../components/category/category-row.component";
import { Paginator } from "../../components/layout/paginator.component";
import Card from "../../components/layout/card.component";
import Loading from "../../components/layout/loading.component";
import { Button } from "../../components/layout/button";
import Translation from "../../components/localization/translation.component";
import BreadCrumbs from "../../components/breadcrumb/breadcrumb.component";
import BreadCrumbItem from "../../components/breadcrumb/breadcrumb-item.component";

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
    return <div className="CategoryOverview">
        <BreadCrumbs>
            <BreadCrumbItem label='page.nav.settings'/>
            <BreadCrumbItem label='page.nav.settings.categories'/>
        </BreadCrumbs>

        <Card title='page.nav.settings.categories' actions={ [
            <Button label='page.settings.categories.add' variant='primary' icon={ mdiPlus } href='./add'
                    key='add'/>
        ] }>
            <table className='Table'>
                <thead>
                <tr>
                    <th className='w-[60px]'/>
                    <th><Translation label='Category.label'/></th>
                    <th><Translation label='Category.description'/></th>
                    <th><Translation label='Category.lastActivity'/></th>
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
                            <Translation label='common.overview.noresults'/>
                        </td>
                    </tr> }
                </tbody>
            </table>

            { hasContent && <Paginator page={ parseInt(page) }
                                       records={ pagination?.records }
                                       pageSize={ pagination?.pageSize }/> }
        </Card>
    </div>
}

export default CategoryListing