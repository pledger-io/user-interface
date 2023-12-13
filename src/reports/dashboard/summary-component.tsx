import { Formats, Layout, Translations } from "../../core";
import Icon from "@mdi/react";
import React, { FC, useEffect, useState } from "react";

type SummaryComponentProps = {
    title: string,
    icon: any,
    currency: string,
    currentPromise?: Promise<number>,
    previousPromise?: Promise<number>
}

const SummaryComponent: FC<SummaryComponentProps> = ({ title, icon, currency, currentPromise, previousPromise }) => {
    const [current, setCurrent] = useState(0)
    const [previous, setPrevious] = useState(0)
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
        <Layout.Card>
            <div className='flex flex-row justify-between'>
                <div className='min-w-[100px] min-h-[125px]'>
                    <h1 className='text-2xl'>
                        <Translations.Translation label={title} />
                    </h1>
                    <span className='text-3xl'>
                        <Formats.Money money={current} currency={currency} />
                    </span>
                    { previous !== null && (
                        <div className={`
                            text-lg pl-7 bg-no-repeat flex items-center mt-2
                            whitespace-nowrap bg-left-bottom
                            Comparison ${comparisonClass}`}>
                            <Translations.Translation label={comparisonKey} />
                        </div>
                    )}
                </div>
                {icon && <Icon path={icon} className='w-[125px]'/>}
            </div>
        </Layout.Card>
    </>
}

export default SummaryComponent