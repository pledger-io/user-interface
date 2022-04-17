import React from "react";
import {FormContext} from "../Form";

export class ToggleInput extends React.Component {
    static contextType = FormContext

    constructor(props, context) {
        super(props, context);

        this.state = {
            checked: props.value
        }
    }

    render() {
        const {id, onChange = () => {}} = this.props
        const {checked} = this.state
        const changeHandler = (evt) => {
            const newChecked = !checked
            onChange(newChecked)
            this.setState({
                checked: newChecked
            })
        }

        return <div className='Switch'>
            <input name={id} id={id} defaultChecked={checked} type='checkbox'/>
            <label htmlFor={id} onClick={changeHandler}/>
        </div>
    }
}
