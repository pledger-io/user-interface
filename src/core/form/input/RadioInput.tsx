import {InputGroup, useInputField} from "./InputGroup";
import {FieldType} from "../form-types";


type RadioInputProps = FieldType & {
    options: {
        message: string,
        value: string
    }[]
    title?: string,
    help?: string,
    readonly?: boolean,
    onChange?: (_: any) => void,
    className?: string
}


const RadioInput = (props: RadioInputProps) => {
    const [field, errors, onChange] = useInputField({onChange: props.onChange, field: props})

    if (!field) return <>props.id</>
    return <>
        <InputGroup id={props.id}
                    required={props.required}
                    title={props.title}
                    help={props.help}
                    className={props.className}
                    valid={field.touched ? errors.length === 0 : undefined }>
            { props.options.map(option => <div key={ option.value }>
                <input type='radio'
                       defaultChecked={ option.value === field.value }
                       value={ option.value }
                       name={ field.id }
                       onChange={ onChange }
                       className='mr-1'
                       key={ option.value } />
                { option.message }
            </div> ) }
        </InputGroup>
    </>
}

export default RadioInput