import { Card } from "primereact/card";
import { Message } from "primereact/message";
import { useNavigate } from "react-router";
import React, { useCallback, useEffect, useReducer, useRef, useState } from "react";
import BreadCrumbItem from "../../components/breadcrumb/breadcrumb-item.component";
import BreadCrumbMenu from "../../components/breadcrumb/breadcrumb-menu.component";
import BreadCrumbs from "../../components/breadcrumb/breadcrumb.component";
import { YearMonth } from "../../components/layout/dropdown";
import { i10n } from "../../config/prime-locale";
import BudgetRepository from "../../core/repositories/budget.repository";
import useDateRange from "../../hooks/date-range.hook";
import BudgetDetailComponent from "../../components/budget/budget-detail.component";
import { Budget } from "../../types/types";

const parseBudgetDateAsLocal = (value: unknown): Date | null => {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return new Date(value.getFullYear(), value.getMonth(), value.getDate())
  }

  if (typeof value === "number") {
    const fromEpoch = new Date(value)
    if (!Number.isNaN(fromEpoch.getTime())) {
      return new Date(fromEpoch.getFullYear(), fromEpoch.getMonth(), fromEpoch.getDate())
    }
    return null
  }

  if (typeof value === "string") {
    const normalized = value.trim().replace(/^"|"$/g, "")
    const isoPattern = /^(\d{4})-(\d{2})(?:-(\d{2}))?$/
    const isoMatch = isoPattern.exec(normalized)
    if (isoMatch) {
      const year = Number.parseInt(isoMatch[1], 10)
      const month = Number.parseInt(isoMatch[2], 10)
      const day = Number.parseInt(isoMatch[3] || "1", 10)
      return new Date(year, month - 1, day)
    }

    const parsed = new Date(normalized)
    if (!Number.isNaN(parsed.getTime())) {
      return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate())
    }
  }

  return null
}

const extractFirstBudgetDate = (budget: Budget): Date | null => {
  const period = (budget as any)?.period || {}
  return parseBudgetDateAsLocal(period.from || period.startDate)
}

const errorStatusCode = (error: unknown) => {
  const typedError = error as { status?: number, response?: { status?: number } } | undefined
  return typedError?.status || typedError?.response?.status
}

type FirstBudgetLoadState = {
  status: "loading" | "ready" | "error"
  firstBudget?: Date
}

type FirstBudgetLoadAction =
  | { type: "loading" }
  | { type: "ready", firstBudget: Date }
  | { type: "error" }

const firstBudgetLoadReducer = (state: FirstBudgetLoadState, action: FirstBudgetLoadAction): FirstBudgetLoadState => {
  switch (action.type) {
    case "loading":
      return {
        ...state,
        status: "loading"
      }
    case "ready":
      return {
        status: "ready",
        firstBudget: action.firstBudget
      }
    case "error":
      return {
        status: "error",
        firstBudget: undefined
      }
  }
}

const BudgetOverview = () => {
  const [firstBudgetState, dispatchFirstBudget] = useReducer(firstBudgetLoadReducer, {
    status: "loading",
    firstBudget: undefined
  })
  const [today] = useState(() => new Date())
  const navigate = useNavigate()
  const [range] = useDateRange()
  const requestIdRef = useRef(0)

  const loadFirstBudget = useCallback(() => {
    const requestId = ++requestIdRef.current
    dispatchFirstBudget({ type: "loading" })

    BudgetRepository.firstBudget()
      .then(budget => {
        if (requestIdRef.current !== requestId) return
        const parsed = extractFirstBudgetDate(budget)
        if (!parsed) {
          dispatchFirstBudget({ type: "error" })
          return
        }
        dispatchFirstBudget({
          type: "ready",
          firstBudget: parsed
        })
      })
      .catch(error => {
        if (requestIdRef.current !== requestId) return
        const statusCode = errorStatusCode(error)
        if (statusCode === 400 || statusCode === 404) {
          navigate('/budgets/first-setup')
          return
        }
        dispatchFirstBudget({ type: "error" })
      })
  }, [navigate])

  useEffect(() => {
    loadFirstBudget()
  }, [loadFirstBudget])

  const onDateChange = ({ year, month }: any) => navigate(`/budgets/${ year }/${ month }`)
  const isFirstBudgetReady = firstBudgetState.status === "ready"
  const hasFirstBudgetError = firstBudgetState.status === "error"
  const firstBudget = firstBudgetState.firstBudget
  const header = () =>
    <div className='px-2 py-2 border-b font-bold flex flex-wrap gap-1 justify-center text-center'>
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
        { isFirstBudgetReady && !hasFirstBudgetError && firstBudget && <YearMonth
            minDate={ firstBudget }
            maxDate={ today }
            onChange={ onDateChange }
            selected={ { month: range.month(), year: range.year() } }/> }
      </BreadCrumbMenu>
    </BreadCrumbs>

    { hasFirstBudgetError && <div className='mx-2 mt-4 lg:mx-6'>
      <Message severity='error'
               text={ i10n('page.budget.overview.firstBudget.error.title') }/>
      <p className='mt-2 text-sm text-red-700'>{ i10n('page.budget.overview.firstBudget.error.body') }</p>
      <div className='mt-2 flex justify-end'>
        <button onClick={ loadFirstBudget }
                className='rounded-md border border-red-300 bg-white px-3 py-1 text-sm font-medium text-red-700 hover:bg-red-100'>
          { i10n('page.budget.overview.action.retry') }
        </button>
      </div>
    </div> }

    { isFirstBudgetReady && !hasFirstBudgetError && <Card header={ header } className='mx-2 my-4 lg:mx-6'>
      <BudgetDetailComponent range={ range }/>
    </Card> }
  </>
}

export default BudgetOverview
