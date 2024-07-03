import { useState } from "react";
import { ButtonBar, Button } from "../button";
import { mdiMenuDown } from "@mdi/js";
import DatePicker from "react-datepicker";

type MonthYearDropdownProps = {
    // The preselected year and month of the dropdown
    selected: {
        month: number,
        year: number
    },
    // The callback used when a new year and month are selected
    onChange: (_: { month: number, year: number }) => void,
    // The minimum date that can be selected
    minDate?: Date,
    // The maximum date that can be selected
    maxDate?: Date
}

const MonthYearDropdown = ({ selected: { year, month }, onChange, minDate, maxDate }: MonthYearDropdownProps) => {
    const [yearOpen, setYearOpen] = useState(false)
    const [monthOpen, setMonthOpen] = useState(false)

    const closeBoth = () => {
        setYearOpen(false)
        setMonthOpen(false)
    }
    const onYearSelect = (date: Date | null) => {
        closeBoth()
        if (date) onChange({ year: date.getFullYear(), month: month })
    }
    const onMonthSelect = (date: Date | null) => {
        closeBoth()
        if (date) onChange({ year: date.getFullYear(), month: date.getMonth() + 1 })
    }
    const onOpenMonth = () => {
        closeBoth()
        setMonthOpen(!monthOpen)
    }
    const onOpenYear = () => {
        closeBoth()
        setYearOpen(!yearOpen)
    }

    const selectedDate = new Date(year, month - 1, 1)

    return (
        <div className='YearMonthDropdown relative'>
            <ButtonBar>
                <Button variant='text'
                        onClick={ onOpenMonth }
                        icon={ mdiMenuDown }
                        iconPos={ 'after' }
                        label={ `common.month.${ month }` }/>
                <Button variant='text'
                        onClick={ onOpenYear }
                        icon={ mdiMenuDown }
                        iconPos={ 'after' }
                        message={ '' + year }/>
            </ButtonBar>

            <div className='Expanded absolute z-10 right-0'>
                { yearOpen && (<DatePicker showYearPicker
                                           dateFormat='yyyy'
                                           minDate={ minDate }
                                           maxDate={ maxDate }
                                           inline
                                           selected={ selectedDate }
                                           onChange={ onYearSelect }/>) }
                { monthOpen && (<DatePicker showMonthYearPicker
                                            dateFormat='MM'
                                            minDate={ minDate }
                                            maxDate={ maxDate }
                                            selected={ selectedDate }
                                            onChange={ onMonthSelect }
                                            inline/>) }
            </div>
        </div>
    )
}

export default MonthYearDropdown
