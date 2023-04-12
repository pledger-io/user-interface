import {useEffect, useState} from "react";
import {CurrencyRepository} from "../RestAPI";
import {Button} from "../buttons";
import {mdiMenuDown} from "@mdi/js";
import PropTypes from "prop-types";

const CurrencyDropdown = ({currency, onChange = (currency) => undefined}) => {
    const [currencyOpen, setCurrencyOpen] = useState(false)
    const [currencies, setCurrencies]     = useState([])

    const onSelect = selected => onChange(selected) || setCurrencyOpen(false)

    useEffect(() => {
        CurrencyRepository.list()
            .then(setCurrencies)
    }, [])

    return (
        <div className="CurrencyDropdown">
            <Button variant='text'
                            onClick={() => setCurrencyOpen(true)}
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
CurrencyDropdown.propTypes = {
    // The currently selected currency
    currency: PropTypes.string,
    // The callback used when a currency is selected
    onChange: PropTypes.func
}

export default CurrencyDropdown
