import React from "react";
import restAPI from "../core/RestAPI";

import {Form, Input, SubmitButton, Styles} from '../core/form'
import {BreadCrumbItem, BreadCrumbs, Buttons, Card, Message, Notifications} from "../core";
import {mdiCancel, mdiContentSave} from "@mdi/js";
import {withNavigation} from "../core/hooks";

class CategoryService {
    load(categoryId) {
        return restAPI.get(`categories/${categoryId}`)
    }

    update(categoryId, category) {
        return restAPI.post(`categories/${categoryId}`, category)
    }

    create(category) {
        return restAPI.put('categories', category)
    }
}

const service = new CategoryService()

class CategoryForm extends React.Component {

    state = {
        id: NaN,
        category: null,
        exception: null
    }

    constructor(props, context) {
        super(props, context);

        const {pathContext} = this.props
        pathContext.resolved = params => this.updatePathParams(params)
    }

    updatePathParams(params) {
        const {id} = params

        if (isNaN(id)) {
            this.setState({
                ...this.state,
                category: {
                    label: '',
                    description: '',
                }
            })
        } else {
            service.load(id)
                .then(resolved => {
                    this.setState({
                        id: id,
                        category: resolved,
                        loaded: true
                    })
                })
                .catch(exception => this.setState({
                    ...this.state,
                    exception: exception,
                    loaded: true
                }))
        }
    }

    process(entity) {
        const {id} = this.state

        if (isNaN(id)) {
            service.create(entity)
                .then(() => Notifications.Service.success('page.category.create.success'))
                .then(() => this.props.navigate(-1))
                .catch(exception => {
                    this.setState({
                        ...this.state,
                        exception: exception
                    })
                    Notifications.Service.warning('page.category.create.failed')
                })
        } else {
            service.update(id, entity)
                .then(() => Notifications.Service.success('page.category.update.success'))
                .then(() => this.props.navigate(-1))
                .catch(exception => {
                    this.setState({
                        ...this.state,
                        exception: exception
                    })
                    Notifications.Service.warning('page.category.update.failed')
                })
        }
    }

    render() {
        let {category} = this.state

        if (!category) {
            return ''
        }

        return (
            <div className='CategoryForm'>
                <BreadCrumbs>
                    <BreadCrumbItem label='page.nav.settings'/>
                    <BreadCrumbItem label='page.nav.settings.categories'/>
                </BreadCrumbs>

                <Form entity='Category' onSubmit={this.process.bind(this)} style={Styles.Inline}>
                    <Card title='page.settings.categories.add'
                          buttons={[
                              <SubmitButton key='save' label='common.action.save' icon={mdiContentSave}/>,
                              <Buttons.BackButton key='cancel' label='common.action.cancel' icon={mdiCancel}/>]}>
                        {this.renderExceptions()}
                        <Message label='page.settings.category.help' variant='info'/>
                        <Input.Text id='name'
                                    title='Category.label'
                                    type='text'
                                    value={category.label}
                                    required/>
                        <Input.TextArea id='description'
                                   title='Category.description'
                                   type='text'
                                   value={category.description}/>
                    </Card>
                </Form>
            </div>
        );
    }

    renderExceptions() {
        const {exception} = this.state
        if (exception) {
            return <Message message={exception} variant='warning'/>
        }

        return '';
    }
}

const formWithNavigate = withNavigation(CategoryForm)

export {
    formWithNavigate as CategoryForm
}
