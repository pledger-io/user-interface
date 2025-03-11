import Icon from "@mdi/react";
import { Calendar } from "primereact/calendar";
import { OverlayPanel } from "primereact/overlaypanel";
import { useRef } from "react";
import { i10n } from "../../../config/prime-locale";
import { mdiMenuDown } from "@mdi/js";

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

const MonthYearDropdown = ({ selected: { year, month }, onChange }: MonthYearDropdownProps) => {
  const yearPickerRef = useRef<OverlayPanel>(null)
  const monthPickerRef = useRef<OverlayPanel>(null)

  const onYearSelect = (date: Date | null | undefined) => {
    yearPickerRef.current?.hide()
    if (date) onChange({ year: date.getFullYear(), month: month })
  }
  const onMonthSelect = (date: Date | null | undefined) => {
    monthPickerRef.current?.hide()
    if (date) onChange({ year: date.getFullYear(), month: date.getMonth() + 1 })
  }

  const selectedDate = new Date(year, month - 1, 1)
  return (
      <div className='flex gap-2 justify-end relative'>
        <a onClick={ event => monthPickerRef.current?.toggle(event) } className='flex items-center cursor-pointer'>
          { i10n('common.month.' + month) }
          <Icon path={ mdiMenuDown } size={ 1 }/>
        </a>
        <a onClick={ e => yearPickerRef.current?.toggle(e) } className='flex items-center cursor-pointer'>
          { year }
          <Icon path={ mdiMenuDown } size={ 1 }/>
        </a>

        <OverlayPanel ref={ monthPickerRef } className='min-w-[15rem] [&>.p-overlaypanel-content]:p-0!'>
          <Calendar view='month' inputClassName='hidden'
                    className='w-full'
                    value={ selectedDate }
                    onChange={ event => onMonthSelect(event.value) } inline/>
        </OverlayPanel>

        <OverlayPanel ref={ yearPickerRef } className='min-w-[15rem] [&>.p-overlaypanel-content]:p-0!'>
          <Calendar view='year' inputClassName='hidden'
                    className='w-full'
                    value={ selectedDate }
                    onChange={ event => onYearSelect(event.value) } inline/>
        </OverlayPanel>
      </div>
  )
}

export default MonthYearDropdown
