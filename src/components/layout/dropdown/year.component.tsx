import { useState } from "react";
import { Button } from "../button";
import { mdiMenuDown } from "@mdi/js";
import DatePicker from "react-datepicker";
import * as React from "react";

type YearDropdownProps = {
    // The preselected year of the dropdown
    year?: number,
    // The callback used when a new year is selected
    onChange?: (_: number) => void
}

const YearDropdown = ({ year = 1970, onChange = _ => undefined }: YearDropdownProps) => {
    const [yearOpen, setYearOpen] = useState<boolean>(false)
    const onSelect = (date: Date | null, _: any) => {
        setYearOpen(false)
        if (date && onChange) onChange(date.getFullYear())
    }

    return (
        <div className='relative'>
            <Button variant='text'
                    onClick={ () => setYearOpen(!yearOpen) }
                    icon={ mdiMenuDown }
                    className='inline-flex m-0'
                    iconPos={ 'after' }
                    message={ '' + year }/>

            <div className='absolute w-[15em] right-0 z-40'>
                { yearOpen && (<DatePicker showYearPicker
                                           dateFormat='yyyy'
                                           inline
                                           selected={ new Date(year, 0, 1) }
                                           onChange={ onSelect }/>) }
            </div>
        </div>
    )
}

export default YearDropdown
