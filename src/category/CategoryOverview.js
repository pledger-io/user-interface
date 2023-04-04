import {CategoryRepository} from "../core/RestAPI";
import React, {useEffect, useState} from "react";
import {mdiPlus, mdiSquareEditOutline, mdiTrashCanOutline} from "@mdi/js";
import {
    BreadCrumbItem,
    BreadCrumbs,
    Buttons,
    Card,
    Dialog,
    Formats,
    Notifications,
    Pagination,
    Translations
} from "../core";
import {EntityShapes} from "../config";
import PropTypes from "prop-types";
import {useQueryParam} from "../core/hooks";

const CategoryRow = ({category, deleteCallback = () => undefined}) => {

    const onDelete = _ => CategoryRepository.delete(category)
        .then(() => Notifications.Service.success('page.category.delete.success'))
        .then(() => deleteCallback())
        .catch(() => Notifications.Service.warning('page.category.delete.failed'))

    return (
        <tr>
            <td>
                <Dialog.ConfirmPopup title='common.action.delete'
                                     openButton={<Buttons.Button icon={mdiTrashCanOutline} variant='warning icon'/>}
                                     onConfirm={onDelete}>
                    <Translations.Translation label='page.category.delete.confirm'/>
                </Dialog.ConfirmPopup>
                <Buttons.Button icon={mdiSquareEditOutline} variant='primary icon' href={`${category.id}/edit`}/>
            </td>
            <td>{category.label}</td>
            <td>{category.description}</td>
            <td><Formats.Date date={category.lastUsed}/></td>
        </tr>
    )
}
CategoryRow.propTypes = {
    category: EntityShapes.Category,
    deleteCallback: PropTypes.func.isRequired
}

export const CategoryOverview = () => {
    const [categories, setCategories]   = useState([])
    const [page]                        = useQueryParam('page', "1")
    const [pagination, setPagination]   = useState({})

    const load = React.useCallback(() => {
        CategoryRepository.list(parseInt(page))
            .then(response => setCategories(response.content) || setPagination(response.info))
    }, [page])

    useEffect(() => {
        load()
    }, [load])

    return <>
        <div className="CategoryOverview">
            <BreadCrumbs>
                <BreadCrumbItem label='page.nav.settings'/>
                <BreadCrumbItem label='page.nav.settings.categories'/>
            </BreadCrumbs>

            <Card title='page.nav.settings.categories' actions={[
                <Buttons.Button label='page.settings.categories.add' variant='primary' icon={mdiPlus} href='./add' key='add'/>
            ]}>
                <table className='Table'>
                    <thead>
                    <tr>
                        <th width='50'/>
                        <th><Translations.Translation label='Category.label'/></th>
                        <th><Translations.Translation label='Category.description'/></th>
                        <th><Translations.Translation label='Category.lastActivity'/></th>
                    </tr>
                    </thead>
                    <tbody>
                    {categories.map(c => <CategoryRow deleteCallback={load} category={c} key={c.id}/>)}
                    </tbody>
                </table>

                <Pagination.Paginator page={parseInt(page)} records={pagination.records}
                                      pageSize={pagination.pageSize}/>
            </Card>
        </div>
    </>
}
