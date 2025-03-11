import React, { FC } from "react";
import { Input } from "../../form";

type SplitEditorProps = {
  transaction: {
    split: any[]
  }
  totalChanged: (value: number) => void
}

const SplitEditor: FC<SplitEditorProps> = ({ transaction: { split }, totalChanged }) => {
  const onChange = (value: any[]) => totalChanged ? totalChanged(value.reduce((value: number, split: any) => value + parseFloat(split.amount), 0)) : undefined

  return <div className='flex justify-end'>
    <div className='w-[90%] max-w-[150rem]'>
      <Input.ComplexType id='split'
                         headers={ ['Transaction.description', 'Transaction.amount'] }
                         rowProducer={ ({ renderInput }: { renderInput: any }) => [
                           renderInput('description'),
                           renderInput('amount', 'number')
                         ] }
                         onChange={ onChange }
                         blankEntity={ { description: '', amount: 0 } }
                         value={ split }/>
    </div>
  </div>
}

export default SplitEditor
