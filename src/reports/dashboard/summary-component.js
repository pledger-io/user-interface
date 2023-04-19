import {Formats, Layout, Translations} from "../../core";
import Icon from "@mdi/react";
import React, {useEffect, useState} from "react";

const SummaryComponent = ({ title, icon, currency, currentPromise, previousPromise}) => {
    const [current, setCurrent] = useState(null)
    const [previous, setPrevious] = useState(null)
    const [comparisonClass, setComparisonClass]    = useState('same')
    const [comparisonKey, setComparisonKey]        = useState('page.dashboard.summary.trend.same')

    useEffect(() => {
        if (currentPromise) currentPromise.then(setCurrent)
    }, [currentPromise])
    useEffect(() => {
        if (previousPromise) previousPromise.then(setPrevious)
    }, [previousPromise])

    useEffect(() => {
        if (current < previous) {
            setComparisonKey('page.dashboard.summary.trend.down')
            setComparisonClass('down')
        } else if (current > previous) {
            setComparisonKey('page.dashboard.summary.trend.up')
            setComparisonClass('up')
        }
    }, [current, previous])

    return <>
        <Layout.Card className='SummaryComponent'>
            <div>
                <h1><Translations.Translation label={title} /></h1>
                <Formats.Money money={current} currency={currency} />
                { previous !== null && (
                    <div className={`Comparison ${comparisonClass}`}>
                        <Translations.Translation label={comparisonKey} />
                    </div>
                )}
            </div>
            {icon && <div className="Icon"><Icon path={icon}/></div>}
        </Layout.Card>
    </>
}

export default SummaryComponent