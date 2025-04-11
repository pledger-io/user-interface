import { Card } from "primereact/card";
import { useNavigate } from "react-router";
import React, { useEffect, useState } from "react";
import BreadCrumbItem from "../../components/breadcrumb/breadcrumb-item.component";
import BreadCrumbMenu from "../../components/breadcrumb/breadcrumb-menu.component";
import BreadCrumbs from "../../components/breadcrumb/breadcrumb.component";
import { YearMonth } from "../../components/layout/dropdown";
import { i10n } from "../../config/prime-locale";
import BudgetRepository from "../../core/repositories/budget.repository";
import useDateRange from "../../hooks/date-range.hook";
import BudgetDetailComponent from "../../components/budget/budget-detail.component";

const BudgetOverview = () => {
  const [firstBudget, setFirstBudget] = useState<Date>()
  const navigate = useNavigate()
  const [range] = useDateRange()

  useEffect(() => {
    BudgetRepository.firstBudget()
      .then(date => setFirstBudget(new Date(date)))
      .catch(() => navigate('/budgets/first-setup'))
  }, [navigate])

  const onDateChange = ({ year, month }: any) => navigate(`/budgets/${ year }/${ month }`)
  const header = () =>
    <div className='px-2 py-2 border-b-1 font-bold flex gap-1 justify-center'>
      { i10n('page.budget.overview.title') }:
      <span className='flex gap-1'>
        <span>{ i10n(`common.month.${ range.month() }`) }</span>
          { range.year() }
      </span>
    </div>

  return <>
    <BreadCrumbs>
      <BreadCrumbItem label='page.nav.finances'/>
      <BreadCrumbItem label='page.nav.budget.groups'/>

      <BreadCrumbMenu>
        <YearMonth
          minDate={ firstBudget }
          maxDate={ new Date() }
          onChange={ onDateChange }
          selected={ { month: range.month(), year: range.year() } }/>
      </BreadCrumbMenu>
    </BreadCrumbs>

    <Card header={ header } className='mx-2 my-4'>
      <BudgetDetailComponent range={ range }/>
    </Card>
  </>
}

export default BudgetOverview
