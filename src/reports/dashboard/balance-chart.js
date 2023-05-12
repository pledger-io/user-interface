import {Charts, Layout} from "../../core";
import React, {useEffect, useState} from "react";

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
            <Layout.Loading condition={balanceSeries.length !== 0}>
                <Charts.Chart height={400}
                              id='dashboard-balance-graph'
                              dataSets={balanceSeries}>
                </Charts.Chart>
            </Layout.Loading>
        </Layout.Card>
    </>
}

export default BalanceChart