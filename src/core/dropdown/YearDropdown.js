import {useState} from "react";
import {Button} from "../buttons";
import {mdiMenuDown} from "@mdi/js";
import DatePicker from "react-datepicker";
import PropTypes from "prop-types";

const YearDropdown = ({year = 1970, onChange = _ => undefined}) => {
    const [yearOpen, setYearOpen] = useState(false)
    const onSelect = date => setYearOpen(false) || onChange(date.getFullYear())

    return (
        <div className='YearDropdown'>
            <Button variant='text'
                            onClick={() => setYearOpen(true)}
                            icon={mdiMenuDown}
                            iconPos={'after'}
                            message={'' + year} />

            <div className='Expanded'>
                {yearOpen && (<DatePicker showYearPicker
                                          dateFormat='yyyy'
                                          inline
                                          selected={new Date(year, 0, 1)}
                                          onChange={date => onSelect(date)}/>)}
            </div>
        </div>
    )
}
YearDropdown.propTypes = {
    // The preselected year of the dropdown
    year: PropTypes.number,
    // The callback used when a new year is selected
    onChange: PropTypes.func.isRequired
}

export default YearDropdown
