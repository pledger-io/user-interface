import { InputGroup, useInputField } from "./InputGroup";

export const AmountInput = (props) => {
    const [field, errors, onChange, onBlur] = useInputField({ onChange: props.onChange, field: props })
    const language = localStorage.getItem('language') || 'en';
    const formatter = new Intl.NumberFormat(language, {
        currency: props.currency || 'EUR',
        style: 'currency'
    })

    if (!field) return props.id
    return (
        <InputGroup id={props.id}
                    required={props.required}
                    title={props.title}
                    help={props.help}
                    valid={field.touched ? errors.length === 0 : undefined }>
            <div className='Appender'>
                <span className='Prepend'>
                    {formatter.formatToParts(0)
                        .find(x => x.type === 'currency')
                        ?.value}
                </span>
                <input id={field.id}
                       name={field.id}
                       defaultValue={field.value}
                       required={props.required}
                       min={props.min}
                       max={props.max}
                       readOnly={props.readonly}
                       onChange={onChange}
                       onBlur={onBlur}
                       data-testid={`${props.id}-input`}
                       type='number' />
            </div>
        </InputGroup>
    )
}

