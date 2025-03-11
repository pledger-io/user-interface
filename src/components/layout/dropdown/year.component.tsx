import * as React from "react";
import { useRef } from "react";
import { mdiMenuDown } from "@mdi/js";
import Icon from "@mdi/react";
import { OverlayPanel } from "primereact/overlaypanel";
import { Calendar } from "primereact/calendar";

type YearDropdownProps = {
  // The preselected year of the dropdown
  year?: number,
  // The callback used when a new year is selected
  onChange?: (_: number) => void
}

const YearDropdown = ({ year = 1970, onChange }: YearDropdownProps) => {
  const yearPickerRef = useRef<OverlayPanel>(null)

  const onSelect = (date: Date | null | undefined) => {
    yearPickerRef.current?.hide()
    if (date && onChange) onChange(date.getFullYear())
  }

  return <>
    <div>
      <a onClick={ event => yearPickerRef.current?.toggle(event) } className='flex items-center cursor-pointer'>
        { year }
        <Icon path={ mdiMenuDown } size={ 1 }/>
      </a>

      <OverlayPanel ref={ yearPickerRef } className='min-w-[15rem] [&>.p-overlaypanel-content]:p-0!'>
        <Calendar view='year' inputClassName='hidden'
                  className='w-full'
                  value={ new Date(year, 0, 1) }
                  onChange={ event => onSelect(event.value) } inline/>
      </OverlayPanel>
    </div>
  </>
}

export default YearDropdown
