import React from "react";
import { Input } from "../../form";

const SplitEditor = ({ transaction: { split }, totalChanged = (_) => {} }) => {
    const onChange = value => totalChanged(value.reduce((value, split) => value + parseFloat(split.amount), 0))

    return <>
        <div className="SplitEditor">
            <Input.ComplexType id='split'
                               headers={['Transaction.description', 'Transaction.amount']}
                               rowProducer={({ renderInput }) => [
                                   renderInput('description'),
                                   renderInput('amount', 'number')
                               ]}
                               onChange={onChange}
                               blankEntity={{ description: '', amount: 0 }}
                               value={split}/>
        </div>
    </>
}

export default SplitEditor