import PropTypes from 'prop-types';
import React from "react";
import { mdiDelete, mdiTablePlus } from "@mdi/js";

import { Buttons, Translations } from "../../index";
import { FormContext } from "../Form";

function createUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        // eslint-disable-next-line
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export class ComplexTypeInput extends React.Component {
    static contextType = FormContext
    static propTypes = {
        id: PropTypes.string.isRequired,
        headers: PropTypes.arrayOf(PropTypes.string),
        rowProducer: PropTypes.func.isRequired,
        blankEntity: PropTypes.object,
        onChange: PropTypes.func
    }

    constructor(props, context) {
        super(props, context);

        this.registerField()
    }

    registerField() {
        this.context.addField({
            field: this.props,
            value: this.props.value?.map(el => {
                return {
                    ...el,
                    _uuid: createUUID()
                }
            })
        })
    }

    renderInput(entity, prop, type) {
        const { id } = this.props
        const onChange = value => {
            const field = this.context.fields[id] || { value: [] };
            const toUpdate = field.value.find(el => el._uuid === entity._uuid)
            toUpdate[prop] = value

            this.onChange(field.value)
        }

        return <input id={`entity_${entity._uuid}_${prop}`}
                      type={type}
                      value={entity[prop]}
                      onChange={evt => onChange(evt.currentTarget.value)} />
    }

    addEntity() {
        const { blankEntity, id } = this.props
        const field = this.context.fields[id] || { value: [] };

        field.value.push({
            _uuid: createUUID(),
            ...blankEntity })

        this.onChange(field.value)
    }

    removeEntity({ _uuid }) {
        const { id } = this.props
        const field = this.context.fields[id] || { value: [] };

        this.onChange(field.value.filter(entity => entity._uuid !== _uuid))
    }

    onChange(value) {
        const { id, onChange = _ => {} } = this.props
        const field = this.context.fields[id] || { id: id, value: [] };

        onChange(value)
        this.context.onChange({
            persist: () => {},
            currentTarget: {
                value: value
            }
        }, field)
    }

    render() {
        const { id, headers, rowProducer } = this.props;
        const field = this.context.fields[id] || {};
        const value = field.value || [];

        if (!field.value && this.props.value) {
            setTimeout(() => this.registerField(), 50)
        }

        return <table className='Table'>
            { headers && <thead>
            <tr>
                {headers.map(header =>
                    <th key={header}>
                        <Translations.Translation label={header}/>
                    </th>)}
                <th/>
            </tr>
            </thead> }
            <tbody>
            {value.map(entity =>
                <tr key={entity._uuid}>
                    {rowProducer({ renderInput: (prop, type = 'text') => this.renderInput(entity, prop, type) })
                        .map((field, idx) => <td key={`${entity._uuid}_${idx}`}>{field}</td>)}
                    <td>
                        <Buttons.Button
                            icon={mdiDelete}
                            onClick={() => this.removeEntity(entity)}
                            variant='icon'
                            className='warning'/>
                    </td>
                </tr>)}
            </tbody>
            <tfoot>
            <tr>
                <td colSpan={headers.length + 1}>
                    <Buttons.Button
                        icon={mdiTablePlus}
                        onClick={() => this.addEntity()}
                        variant='icon'
                        className='primary' />
                </td>
            </tr>
            </tfoot>
        </table>
    }
}
