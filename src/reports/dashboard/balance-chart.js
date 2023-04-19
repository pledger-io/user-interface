import {Charts, Layout} from "../../core";
import React, {useEffect, useState} from "react";
import {Loading} from "../../core/layout";

const BalanceChart = ({ range }) => {
    const [balanceSeries, setBalanceSeries] = useState([])

    useEffect(() => {
        Charts.SeriesProvider.balanceSeries({
            id: 'balance-series',
            title: 'graph.series.balance',
            dateRange: range,
            allMoney: true
        }).then(result => setBalanceSeries([result]))
    }, [range])

    return <>
        <Layout.Card title='page.dashboard.accounts.balance'>
            <Loading condition={balanceSeries.length !== 0}>
                <Charts.Chart height={400}
                              id='dashboard-balance-graph'
                              dataSets={balanceSeries}>
                </Charts.Chart>
            </Loading>
        </Layout.Card>
    </>
}

export default BalanceChart