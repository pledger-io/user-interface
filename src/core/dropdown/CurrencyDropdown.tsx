import { useEffect, useState } from "react";
import { CurrencyRepository } from "../RestAPI";
import { Button } from "../buttons";
import { mdiMenuDown } from "@mdi/js";
import { Currency } from "../types";

type CurrencyDropdownProps = {
    // The currently selected currency
    currency: string,
    // The callback used when a currency is selected
    onChange: (_: Currency) => void
}

const CurrencyDropdown = ({ currency, onChange = _ => undefined }: CurrencyDropdownProps) => {
    const [currencyOpen, setCurrencyOpen] = useState(false)
    const [currencies, setCurrencies] = useState<Currency[]>([])

    const onSelect = (selected: Currency) => {
        onChange(selected)
        setCurrencyOpen(false)
    }

    useEffect(() => {
        CurrencyRepository.list()
            .then(setCurrencies)
    }, [])

    return (
        <div className="relative">
            <Button variant='text'
                    onClick={ () => setCurrencyOpen(!currencyOpen) }
                    icon={ mdiMenuDown }
                    className={ 'inline-flex m-0' }
                    iconPos={ 'after' }
                    message={ currency }/>

            <div className='absolute w-[10em] right-0 z-40'>
                { currencyOpen && (
                    currencies
                        .map(currency =>
                            <Button message={ `${ currency.name } (${ currency.symbol })` }
                                    onClick={ () => onSelect(currency) }
                                    key={ currency.code }
                                    variant='secondary'
                                    className='w-full rounded-none'/>)
                ) }
            </div>
        </div>
    )
}

export default CurrencyDropdown
