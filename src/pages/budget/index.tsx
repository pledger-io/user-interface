import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import BreadCrumbItem from "../../components/breadcrumb/breadcrumb-item.component";
import BreadCrumbMenu from "../../components/breadcrumb/breadcrumb-menu.component";
import BreadCrumbs from "../../components/breadcrumb/breadcrumb.component";
import { YearMonth } from "../../components/layout/dropdown";
import BudgetRepository from "../../core/repositories/budget.repository";
import useDateRange from "../../hooks/date-range.hook";

import BudgetDetailComponent from "../../components/budget/budget-detail.component";
import Card from "../../components/layout/card.component";

const BudgetOverview = () => {
    const [firstBudget, setFirstBudget] = useState<Date>()
    const navigate = useNavigate()
    const [range] = useDateRange()

    useEffect(() => {
        BudgetRepository.firstBudget()
            .then(date => setFirstBudget(new Date(date)))
            .catch(() => navigate('/budgets/first-setup'))
    }, [navigate])

    const onDateChange = ({ year, month } : any) => navigate(`/budgets/${year}/${month}`)

    return <>
        <BreadCrumbs>
            <BreadCrumbItem label='page.nav.finances' />
            <BreadCrumbItem label='page.nav.budget.groups' />

            <BreadCrumbMenu>
                <YearMonth
                    minDate={ firstBudget }
                    maxDate={ new Date() }
                    onChange={ onDateChange }
                    selected={ { month: range.month(), year: range.year() } }/>
            </BreadCrumbMenu>
        </BreadCrumbs>

        <Card title='page.budget.overview.title'>
            <BudgetDetailComponent range={ range } />
        </Card>
    </>
}

export default BudgetOverview