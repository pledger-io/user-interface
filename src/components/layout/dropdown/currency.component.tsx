import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { CurrencyRepository } from "../../../core/RestAPI";
import { mdiMenuDown } from "@mdi/js";
import { Currency } from "../../../types/types";
import Icon from "@mdi/react";
import { Menu } from "primereact/menu";
import { MenuItem } from "primereact/menuitem";

type CurrencyDropdownProps = {
  // The currently selected currency
  currency: string,
  // The callback used when a currency is selected
  onChange: (_: Currency) => void
}

const CurrencyDropdown = ({ currency, onChange }: CurrencyDropdownProps) => {
  const menuRef = useRef<Menu>(null)
  const [currencies, setCurrencies] = useState<MenuItem[]>([])

  useEffect(() => {
    CurrencyRepository.list()
      .then((currencies: Currency[]) => {
        const menuItems = currencies
          .filter(currency => currency.enabled)
          .map(currency => ({
            label: currency.code,
            icon: () => <>{ currency.symbol }</>,
            command: () => onChange(currency)
          }))

        setCurrencies(menuItems)
      })
  }, [])

  return <>
    <a onClick={ event => menuRef.current?.toggle(event) } className='flex items-center cursor-pointer'>
      { currency }
      <Icon path={ mdiMenuDown } size={ 1 }/>
    </a>
    <Menu ref={ menuRef }
          popup
          className='max-w-[8rem]'
          model={ currencies } />
  </>
}

export default CurrencyDropdown
