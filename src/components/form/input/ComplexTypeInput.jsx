import PropTypes from 'prop-types';
import React from "react";
import { mdiDelete, mdiTablePlus } from "@mdi/js";

import { FormContext } from "../Form";
import { Button } from "../../layout/button";
import Translation from "../../localization/translation.component";
import { Resolver } from "../../../core";
import { i10n } from "../../../config/prime-locale.js";

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
      field: {
        ...this.props,
        value: this.props.value?.map(el => {
          return {
            ...el,
            _uuid: Resolver.uuid(),
          }
        })
      }
    })
  }

  renderInput(entity, prop, type) {
    const { id } = this.props
    const onChange = value => {
      const field = this.context.fields[id] || { value: [] };
      const toUpdate = field.value.find(el => el._uuid === entity._uuid)
      toUpdate[prop] = value

      console.log(toUpdate)

      this.onChange(field.value)
    }

    return <input id={`entity_${entity._uuid}_${prop}`}
                  type={ type }
                  defaultValue={ entity[prop] }
                  className='p-control p-inputtext w-full'
                  onChange={ evt => onChange(evt.currentTarget.value) }/>
  }

  addEntity() {
    const { blankEntity, id } = this.props
    const field = this.context.fields[id] || { value: [] };

    const updated = [...(field.value || []), {
      _uuid: Resolver.uuid(),
      ...blankEntity
    }]

    this.onChange(updated)
  }

  removeEntity({ _uuid }) {
    const { id } = this.props
    const field = this.context.fields[id] || { value: [] };

    this.onChange(field.value.filter(entity => entity._uuid !== _uuid))
  }

  onChange(value) {
    const {
      id, onChange = _ => {
      }
    } = this.props
    const field = this.context.fields[id] || { id: id, value: [] };

    onChange(value)
    this.context.onChange({
      persist: () => {
      },
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

    return <table className='w-full'>
      {headers && <thead>
      <tr>
        {headers.map(header => <th key={header} className='font-bold p-3 text-left border-b-1'>{ i10n(header) }</th>)}
        <th className='font-bold p-3 text-left border-b-1 w-[1rem]'/>
      </tr>
      </thead>}
      <tbody>
      {value.map(entity =>
        <tr key={entity._uuid}>
          {rowProducer({ renderInput: (prop, type = 'text') => this.renderInput(entity, prop, type) })
            .map((field, idx) => <td key={`${entity._uuid}_${idx}`} className='p-2'>{field}</td>)}
          <td>
            <Button
              type='button'
              icon={mdiDelete}
              onClick={() => this.removeEntity(entity)}
              severity='warning'
              outlined={ true} />
          </td>
        </tr>)}
      </tbody>
      <tfoot>
      <tr>
        <td colSpan={headers.length + 1} className='text-right'>
          <Button
            type='button'
            icon={mdiTablePlus}
            onClick={() => this.addEntity()}
            outlined={ true }
            className='primary'/>
        </td>
      </tr>
      </tfoot>
    </table>
  }
}
