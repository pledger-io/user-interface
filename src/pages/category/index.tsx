import React, { useEffect, useState } from "react";
import useQueryParam from "../../hooks/query-param.hook";
import CategoryRepository from "../../core/repositories/category-repository";
import { Category, Pagination } from "../../types/types";
import { Card } from "primereact/card";
import BreadCrumbs from "../../components/breadcrumb/breadcrumb.component";
import BreadCrumbItem from "../../components/breadcrumb/breadcrumb-item.component";
import { i10n } from "../../config/prime-locale";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import DateComponent from "../../components/format/date.component";
import { Paginator } from "primereact/paginator";
import { NavLink, useNavigate } from "react-router";
import Icon from "@mdi/react";
import { mdiAlertCircleOutline, mdiPlus, mdiSquareEditOutline, mdiTrashCanOutline } from "@mdi/js";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import NotificationService from "../../service/notification.service";

const ActionButtons = ({ category, deleteCallback }: { category: Category, deleteCallback: () => void }) => {

    const confirmDelete = () => {
        confirmDialog({
            message: i10n('page.category.delete.confirm'),
            header: i10n('common.action.delete'),
            icon: () => <Icon path={ mdiAlertCircleOutline } size={ 1 }/>,
            defaultFocus: 'reject',
            acceptClassName: 'p-button-danger',
            accept: () => {
                CategoryRepository.delete(category)
                    .then(() => NotificationService.success('page.category.delete.success'))
                    .then(() => deleteCallback())
                    .catch(() => NotificationService.warning('page.category.delete.failed'))
            }
        })
    }
    return <div className='flex gap-0.5 items-center'>
        <NavLink to={ `${ category.id }/edit` }>
            <Icon path={ mdiSquareEditOutline } size={ .8 }/>
        </NavLink>
        <a onClick={ confirmDelete } className='cursor-pointer text-dark-warning'>
            <Icon path={ mdiTrashCanOutline } size={ .8 }/>
        </a>
    </div>
}

const CategoryListing = () => {
    const [categories, setCategories] = useState<Category[] | undefined>(undefined)
    const [page] = useQueryParam({ key: 'page', initialValue: "1" })
    const [pagination, setPagination] = useState<Pagination>()
    const navigate = useNavigate()

    const load = React.useCallback(() => {
        setCategories(undefined)
        CategoryRepository.list(parseInt(page))
            .then(response => {
                setCategories(response.content || [])
                setPagination(response.info)
            })
    }, [page])

    useEffect(() => {
        load()
    }, [load])

    const header = () => <div className='px-2 py-2 border-b-1 text-center font-bold'>
        { i10n('page.nav.settings.categories') }
    </div>

    return <>
        <BreadCrumbs>
            <BreadCrumbItem label='page.nav.settings'/>
            <BreadCrumbItem label='page.nav.settings.categories'/>
        </BreadCrumbs>

        <ConfirmDialog/>

        <Card className='my-4 mx-2' header={ header }>
            <div className='flex justify-end'>
                <NavLink to={ './add' } key='add'
                         className='p-button p-button-success p-button-sm !mb-4 gap-1 items-center'>
                    <Icon path={ mdiPlus } size={ .8 }/> { i10n('page.settings.categories.add') }
                </NavLink>
            </div>

            <DataTable value={ categories } size='small' loading={ !categories }>
                <Column header={ i10n('Category.label') } body={ category => <>
                    <div>{ category.label }</div>
                    <div className='text-sm text-muted'>{ category.description }</div>
                </> }/>
                <Column body={ category => <DateComponent date={ category.lastUsed }/> }
                        header={ i10n('Category.lastActivity') }></Column>
                <Column body={ category => <ActionButtons category={ category } deleteCallback={ load }/> } className='w-[1rem]' />
            </DataTable>

            { (pagination?.records || 0) > 0
                && <Paginator totalRecords={ pagination?.records }
                              rows={ pagination?.pageSize }
                              onPageChange={ ({ page }) => navigate('?page=' + (page + 1)) }/> }
        </Card>

    </>
}

export default CategoryListing
