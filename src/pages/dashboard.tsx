import React from "react";

import { BreadCrumbItem, BreadCrumbs, Dates } from "../core";

import Summary from "../components/dashboard/summary";
import BalanceChart from "../components/dashboard/balance-chart";
import BudgetBalance from "../components/dashboard/budget-balance";
import CategoriesBalance from "../components/dashboard/categories-balance";
import Grid from "../components/layout/grid.component";

import '../components/dashboard/dashboard.scss'

const DASHBOARD_DAYS = 90

const range = Dates.Ranges.previousDays(DASHBOARD_DAYS)
const compareRange = range.before(DASHBOARD_DAYS)

const Dashboard = () => {

    return <>
        <BreadCrumbs>
            <BreadCrumbItem label='page.nav.dashboard' />
        </BreadCrumbs>
        <div className="Dashboard">
            <Summary range={ range } compareRange={ compareRange } />

            <BalanceChart range={ range }/>

            <Grid type='column' minWidth='35em'>
                <BudgetBalance range={ range } />
                <CategoriesBalance range={ range } />
            </Grid>
        </div>
    </>
}

export default Dashboard