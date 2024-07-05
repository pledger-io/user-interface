import CategoryRepository from "../../core/repositories/category-repository";
import { mdiSquareEditOutline, mdiTrashCanOutline } from "@mdi/js";
import React from "react";
import { Category } from "../../types/types";
import DateComponent from "../format/date.component";
import { Button } from "../layout/button";
import { Confirm } from "../layout/popup";

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
                <Confirm title='common.action.delete'
                                         openButton={ <Button icon={ mdiTrashCanOutline }
                                                                  variant='icon'
                                                                  className='warning'/> }
                                         onConfirm={ onDelete }>
                    <Translation label='page.category.delete.confirm'/>
                </Confirm>
                <Button icon={ mdiSquareEditOutline }
                                variant='icon'
                                className='primary'
                                href={ `${ category.id }/edit` }/>
            </td>
            <td>{ category.label }</td>
            <td>{ category.description }</td>
            <td><DateComponent date={ category.lastUsed }/></td>
        </tr>
    )
}

export default CategoryRow