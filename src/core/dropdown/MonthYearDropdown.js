import {useState} from "react";
import {Button} from "../buttons";
import {mdiMenuDown} from "@mdi/js";
import DatePicker from "react-datepicker";
import PropTypes from "prop-types";

const MonthYearDropdown = ({selected: {year, month}, onChange}) => {
    const [yearOpen, setYearOpen]   = useState(false)
    const [monthOpen, setMonthOpen] = useState(false)

    const closeBoth     = ()    => setYearOpen(false) || setMonthOpen(false)
    const onYearSelect  = date  => closeBoth() || onChange({year: date.getFullYear(), month: month})
    const onMonthSelect = date  => closeBoth() || onChange({year: date.getFullYear(), month: date.getMonth() + 1})
    const onOpenMonth   = ()    => closeBoth() || setMonthOpen(!monthOpen)
    const onOpenYear    = ()    => closeBoth() || setYearOpen(!yearOpen)

    const selectedDate = new Date(year, month - 1, 1)

    return (
        <div className='YearMonthDropdown'>
            <Button variant='text'
                            onClick={onOpenMonth}
                            icon={mdiMenuDown}
                            iconPos={'after'}
                            label={`common.month.${month}`} />
            <Button variant='text'
                            onClick={onOpenYear}
                            icon={mdiMenuDown}
                            iconPos={'after'}
                            message={'' + year} />

            <div className='Expanded'>
                {yearOpen && (<DatePicker showYearPicker
                                          dateFormat='yyyy'
                                          inline
                                          selected={selectedDate}
                                          onChange={onYearSelect}/>)}
                {monthOpen && (<DatePicker showMonthYearPicker
                                           dateFormat='MM'
                                           selected={selectedDate}
                                           onChange={onMonthSelect}
                                           inline />)}
            </div>
        </div>
    )
}
MonthYearDropdown.propTypes = {
    selected: PropTypes.shape({
        month: PropTypes.number,
        year: PropTypes.number
    }),
    onChange: PropTypes.func.isRequired
}
export default MonthYearDropdown
