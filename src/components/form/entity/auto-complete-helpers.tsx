import { mdiPlus } from "@mdi/js";
import Icon from "@mdi/react";
import { AutoCompleteChangeEvent } from "primereact/autocomplete";
import React from "react";
import { i10n } from "../../../config/prime-locale";
import { InputChangeFunc } from "../form-types";

export function autoCompleteChangeHandler(onChange: InputChangeFunc<any>) {
  return (e: AutoCompleteChangeEvent) => {
    onChange({
      currentTarget: {
        value: e.value
      }
    })
  }
}

export function autoCompleteFooter(onCreate: () => void, label: string) {
  return <>
    <div className='bg-gray-500/30 py-0.5 text-center cursor-pointer'
         onClick={ onCreate }
         data-testid='autocomplete-input-create'>
      <span className='mx-auto inline-flex'>
        <Icon path={ mdiPlus } size={ 1 }/>
        { i10n(label) }
      </span>
    </div>
  </>
}
