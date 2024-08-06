import React from "react";

import Summary from "../components/dashboard/summary";
import BalanceChart from "../components/dashboard/balance-chart";
import BudgetBalance from "../components/dashboard/budget-balance";
import CategoriesBalance from "../components/dashboard/categories-balance";
import Grid from "../components/layout/grid.component";
import BreadCrumbs from "../components/breadcrumb/breadcrumb.component";
import BreadCrumbItem from "../components/breadcrumb/breadcrumb-item.component";

import '../components/dashboard/dashboard.scss'
import DateRangeService from "../service/date-range.service";

const DASHBOARD_DAYS = 90

const range = DateRangeService.previousDays(DASHBOARD_DAYS)
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