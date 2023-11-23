import React from "react";

import './style.scss'
import {Dates, Layout} from "../../core";
import Summary from "./summary";
import BalanceChart from "./balance-chart";
import BudgetBalance from "./budget-balance";
import CategoriesBalance from "./categories-balance";

const DASHBOARD_DAYS = 90

const range = Dates.Ranges.previousDays(DASHBOARD_DAYS)
const compareRange = range.before(DASHBOARD_DAYS)

const Dashboard = () => {

    return <>
        <div className="Dashboard">
            <Summary range={ range } compareRange={ compareRange } />

            <BalanceChart range={ range }/>

            <Layout.Grid type='column' minWidth='35em'>
                <BudgetBalance range={ range } />
                <CategoriesBalance range={ range } />
            </Layout.Grid>
        </div>
    </>
}

export default Dashboard