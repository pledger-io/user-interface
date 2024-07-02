import React from "react";
import { Input } from "../../form";

type SplitEditorProps = {
    transaction: {
        split: any[]
    }
    totalChanged: (value: number) => void
}

const SplitEditor = ({ transaction: { split }, totalChanged = (_: number) => {} }: SplitEditorProps) => {
    const onChange = (value: any[]) => totalChanged(value.reduce((value: number, split: any) => value + parseFloat(split.amount), 0))

    return <>
        <div className="SplitEditor">
            <Input.ComplexType id='split'
                               headers={['Transaction.description', 'Transaction.amount']}
                               rowProducer={({ renderInput }: { renderInput : any }) => [
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