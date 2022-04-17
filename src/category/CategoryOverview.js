import restAPI from "../core/RestAPI";
import React from "react";
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

class CategoryService {
    list(pageNumber) {
        return restAPI.post('categories', {
            page: pageNumber || 0
        })
    }

    delete(category) {
        return restAPI.delete(`categories/${category.id}`)
    }
}

const categoryService = new CategoryService();

class CategoryRow extends React.Component {
    render() {
        const {category} = this.props

        return (
            <tr>
                <td>
                    <Dialog.ConfirmPopup title='common.action.delete'
                                  openButton={<Buttons.Button icon={mdiTrashCanOutline} variant='warning icon'/>}
                                  onConfirm={this.delete.bind(this)}>
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

    delete() {
        const {category, onDelete} = this.props

        categoryService.delete(category)
            .then(() => Notifications.Service.success('page.category.delete.success'))
            .then(() => onDelete())
            .catch(() => Notifications.Service.warning('page.category.delete.failed'))
    }
}

export class CategoryOverview extends React.Component {
    loading = false;

    constructor(props, context) {
        super(props, context);

        const {queryContext} = props;
        this.state = {
            pageNumber: queryContext.page,
            categories: null,
            pagination: {}
        }

        queryContext.resolved = searchQuery => this.setPageNumber(searchQuery.page)
    }

    setPageNumber(pageNumber) {
        this.loading = true;
        categoryService.list(pageNumber)
            .then(resultPage => {
                const {content, info} = resultPage;
                this.setState({
                    pageNumber: parseInt(pageNumber) || 1,
                    categories: content,
                    pagination: info
                })
                this.loading = false;
            })
            .catch(exception => console.error(exception));
    }

    render() {
        const {pageNumber, categories} = this.state;
        const reload = () => this.setPageNumber(pageNumber)
        const headerButton = <Buttons.Button label='page.settings.categories.add' variant='primary' icon={mdiPlus} href='./add'/>

        if (!this.loading && !categories) {
            this.setPageNumber(pageNumber)
        }

        const categoryRows = (categories || []).map(category => <CategoryRow key={category.label} category={category} onDelete={() => reload()}/>)
        return (
            <div className="CategoryOverview">
                <BreadCrumbs>
                    <BreadCrumbItem label='page.nav.settings'/>
                    <BreadCrumbItem label='page.nav.settings.categories'/>
                </BreadCrumbs>

                <Card title='page.nav.settings.categories' actions={headerButton}>
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
                        {categoryRows}
                        </tbody>
                    </table>

                    <Pagination.Paginator page={this.state.pageNumber} records={this.state.pagination.records}
                               pageSize={this.state.pagination.pageSize}/>
                </Card>
            </div>
        )
    }
}
