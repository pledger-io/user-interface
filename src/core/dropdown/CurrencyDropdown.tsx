import {useEffect, useState} from "react";
import {CurrencyRepository} from "../RestAPI";
import {Button} from "../buttons";
import {mdiMenuDown} from "@mdi/js";
import {Currency} from "../types";

type CurrencyDropdownProps = {
    // The currently selected currency
    currency: string,
    // The callback used when a currency is selected
    onChange: (_: Currency) => void
}

const CurrencyDropdown = ({currency, onChange = _ => undefined} : CurrencyDropdownProps) => {
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
        <div className="CurrencyDropdown">
            <Button variant='text'
                            onClick={() => setCurrencyOpen(!currencyOpen)}
                            icon={mdiMenuDown}
                            iconPos={'after'}
                            message={currency} />

            <div className='Expanded'>
                {currencyOpen && (
                    currencies
                        .map(currency =>
                            <Button message={`${currency.name} (${currency.symbol})`}
                                            onClick={() => onSelect(currency)}
                                            key={currency.code}
                                            variant='primary'
                                            variantType='outline' />)
                )}
            </div>
        </div>
    )
}

export default CurrencyDropdown
