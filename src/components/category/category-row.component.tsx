import CategoryRepository from "../../core/repositories/category-repository";
import { Buttons, Dialog, Formats } from "../../core";
import { mdiSquareEditOutline, mdiTrashCanOutline } from "@mdi/js";
import React from "react";
import { Category } from "../../core/types";

import Translation from "../localization/translation.component";
import NotificationService from "../../service/notification.service";

type CategoryRowProps = {
    category: Category,
    deleteCallback?: () => void
}

const CategoryRow = ({ category, deleteCallback = () => undefined }: CategoryRowProps) => {
    const onDelete = () => CategoryRepository.delete(category)
        .then(() => NotificationService.success('page.category.delete.success'))
        .then(() => deleteCallback())
        .catch(() => NotificationService.warning('page.category.delete.failed'))

    return (
        <tr>
            <td className='flex'>
                <Dialog.Confirm title='common.action.delete'
                                         openButton={ <Buttons.Button icon={ mdiTrashCanOutline }
                                                                  variant='icon'
                                                                  className='warning'/> }
                                         onConfirm={ onDelete }>
                    <Translation label='page.category.delete.confirm'/>
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