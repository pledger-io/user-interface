import React, {FC, useEffect, useState} from "react";
import {Account} from "../types";
import {Charts} from "../index";
import {useDateRange} from "../hooks";
import {DataSet} from "./chart-types";
import {Loading} from "../layout";

type BalanceChartProps = {
    id: string
    allMoney: boolean
    accounts: Account | Account[] | undefined
}

const BalanceChart: FC<BalanceChartProps> = ({ id, allMoney, accounts }) => {
    const [balanceSeries, setBalanceSeries] = useState<DataSet[] | undefined>(undefined)
    const [range] = useDateRange()

    useEffect(() => {
        setBalanceSeries(undefined)

        Charts.SeriesProvider.balanceSeries(
            {
                title: 'graph.series.balance',
                dateRange: range,
                allMoney: allMoney,
                accounts: accounts ? (Array.isArray(accounts) ? accounts : [accounts]) : undefined
            })
            .then((result: DataSet) => setBalanceSeries([result]))
    }, [range, allMoney, accounts]);

    if (!balanceSeries) return <Loading />
    return <>
        <Charts.Chart height={ 350 }
                      id={ id }
                      dataSets={ balanceSeries }>
        </Charts.Chart>
    </>
}

export default BalanceChart