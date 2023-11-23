import {useState} from "react";
import {Button} from "../buttons";
import {mdiMenuDown} from "@mdi/js";
import DatePicker from "react-datepicker";

type YearDropdownProps = {
    // The preselected year of the dropdown
    year?: number,
    // The callback used when a new year is selected
    onChange?: (_: number) => void
}

const YearDropdown = ({year = 1970, onChange = _ => undefined}: YearDropdownProps) => {
    const [yearOpen, setYearOpen] = useState<boolean>(false)
    const onSelect = (date: Date) => {
        setYearOpen(false)
        onChange(date.getFullYear())
    }

    return (
        <div className='YearDropdown'>
            <Button variant='text'
                            onClick={() => setYearOpen(!yearOpen)}
                            icon={mdiMenuDown}
                            iconPos={'after'}
                            message={'' + year} />

            <div className='Expanded'>
                {yearOpen && (<DatePicker showYearPicker
                                          dateFormat='yyyy'
                                          inline
                                          selected={new Date(year, 0, 1)}
                                          onChange={(date : Date) => onSelect(date)}/>)}
            </div>
        </div>
    )
}

export default YearDropdown
