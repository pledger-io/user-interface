import CategoryRepository from "../../core/repositories/category-repository";
import { Buttons, Dialog, Formats, Notifications, Translations } from "../../core";
import { mdiSquareEditOutline, mdiTrashCanOutline } from "@mdi/js";
import React from "react";
import { Category } from "../../core/types";

type CategoryRowProps = {
    category: Category,
    deleteCallback?: () => void
}

const CategoryRow = ({ category, deleteCallback = () => undefined }: CategoryRowProps) => {
    const onDelete = () => CategoryRepository.delete(category)
        .then(() => Notifications.Service.success('page.category.delete.success'))
        .then(() => deleteCallback())
        .catch(() => Notifications.Service.warning('page.category.delete.failed'))

    return (
        <tr>
            <td className='flex'>
                <Dialog.Confirm title='common.action.delete'
                                         openButton={ <Buttons.Button icon={ mdiTrashCanOutline }
                                                                  variant='icon'
                                                                  className='warning'/> }
                                         onConfirm={ onDelete }>
                    <Translations.Translation label='page.category.delete.confirm'/>
                </Dialog.Confirm>
                <Buttons.Button icon={ mdiSquareEditOutline }
                                variant='icon'
                                className='primary'
                                href={ `${ category.id }/edit` }/>
            </td>
            <td>{ category.label }</td>
            <td>{ category.description }</td>
            <td><Formats.Date date={ category.lastUsed }/></td>
        </tr>
    )
}

export default CategoryRow