import { useSessionStorage } from "primereact/hooks";
import { Paginator } from "primereact/paginator";
import { Dialog } from "primereact/dialog";
import React, { FC, useEffect, useState } from "react";
import { useNavigate, useRouteLoaderData } from "react-router";
import { i10n } from "../../config/prime-locale";
import { Resolver } from "../../core";
import { TransactionRepository } from "../../core/RestAPI";
import useQueryParam from "../../hooks/query-param.hook";
import { DailyTransactions, groupTransactionByDay } from "../../reducers";
import DateRange from "../../types/date-range.type";
import { AvailableSetting, Pagination, Transaction } from "../../types/types";
import MoneyComponent from "../format/money.component";
import Loading from "../layout/loading.component";
import { Button } from "../layout/button";
import TransactionFilters, { TransactionFilter } from "./list-filters.component";
import {
  applyQuickPreset,
  clearMutableFilters,
  mergeMutableFilters,
  normalizeFilterState,
  pickMutableFilters,
  QUICK_PRESETS,
  TransactionQuickPreset,
  TRANSFER_QUICK_PRESETS
} from "./transaction-filters.utils";
import TransactionItem from "./transaction-detail.component";

type TransactionOverviewProps = {
  range: DateRange,
  transfers: boolean
}

type SavedFilterView = {
  id: string,
  name: string,
  filters: Record<string, any>
}

type ActiveFilterChip = {
  id: string,
  label: string
}

const storageKeyForFilters = (transfers: boolean) =>
  `pledger.transactions.saved-filters.v1.${ transfers ? "transfers" : "income-expense" }`

const loadSavedFilterViews = (transfers: boolean): SavedFilterView[] => {
  try {
    const value = localStorage.getItem(storageKeyForFilters(transfers))
    if (!value) return []
    const parsedValue = JSON.parse(value)
    if (!Array.isArray(parsedValue)) return []

    return parsedValue.filter(view => view && view.id && view.name && view.filters)
  } catch {
    return []
  }
}

const displayFilterValue = (value: any) => {
  if (!value) return ""
  if (typeof value === "string") return value
  return value.name || value.description || value.id || ""
}

const TransactionOverview: FC<TransactionOverviewProps> = ({ range, transfers }) => {
  const [page] = useQueryParam({ key: 'page', initialValue: "1" })
  const [searchCommand, setSearchCommand] = useState<Record<string, any>>({})
  const [transactions, setTransactions] = useState<DailyTransactions | undefined>(undefined)
  const [pagination, setPagination] = useState<Pagination>()
  const [loadError, setLoadError] = useState<string>()
  const [savedFilterViews, setSavedFilterViews] = useState<SavedFilterView[]>(() => loadSavedFilterViews(transfers))
  const [selectedSavedFilterId, setSelectedSavedFilterId] = useState<string>("")
  const [saveDialogVisible, setSaveDialogVisible] = useState(false)
  const [renameDialogVisible, setRenameDialogVisible] = useState(false)
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false)
  const [saveViewName, setSaveViewName] = useState("")
  const [renameViewName, setRenameViewName] = useState("")
  const [numberOfResults, _] = useSessionStorage(20, AvailableSetting.RecordSetPageSize)
  const navigate = useNavigate()

  const routerData = useRouteLoaderData(transfers ? 'transfers' : 'income-expense').searchCommand
  useEffect(() => {
    setSearchCommand(previous => normalizeFilterState(mergeMutableFilters(previous, routerData || {}), transfers))
  }, [routerData]);

  useEffect(() => {
    if (!(searchCommand as any).startDate) return
    setTransactions(undefined)
    setLoadError(undefined)
    const { budget, uncategorized, ...command } = (searchCommand as any)
    const searchRequest = {
      ...command,
      expense: budget?.id || budget,
      category: command.category?.id || command.category,
      account: command.account?.id || command.account,
      offset: uncategorized ? 0 : command.offset,
      numberOfResults: uncategorized ? 5000 : command.numberOfResults
    }

    TransactionRepository.search(searchRequest)
      .then(response => {
        const showOnlyUncategorized = Boolean(uncategorized)
        const filteredTransactions = showOnlyUncategorized
          ? (response.content || []).filter((transaction: Transaction) => !transaction.metadata?.category)
          : (response.content || [])
        setTransactions(filteredTransactions.reduce(groupTransactionByDay, {}))
        setPagination(showOnlyUncategorized
          ? { records: filteredTransactions.length, pageSize: filteredTransactions.length || 1 }
          : response.info)
      })
      .catch(() => {
        setLoadError('page.transactions.list.error.body')
        setTransactions({})
        setPagination(undefined)
      })
  }, [searchCommand])

  useEffect(() => {
    setSearchCommand(previous => {
      return normalizeFilterState({
        ...previous,
        startDate: range.startString(),
        endDate: range.endString(),
        offset: (parseInt(page) -1) * numberOfResults,
        numberOfResults: numberOfResults,
        type: transfers ? 'TRANSFER' : undefined
      }, transfers)
    })
  }, [page, range, transfers])

  useEffect(() => {
    try {
      localStorage.setItem(storageKeyForFilters(transfers), JSON.stringify(savedFilterViews))
    } catch {
      // Keep UI functional when persistence is unavailable.
    }
  }, [savedFilterViews, transfers])

  useEffect(() => {
    setSavedFilterViews(loadSavedFilterViews(transfers))
    setSelectedSavedFilterId("")
  }, [transfers])

  const onFilterChange = (filter: TransactionFilter) => setSearchCommand(oldValue => {
    return normalizeFilterState(mergeMutableFilters(oldValue, {
      ...filter,
      offset: 0
    }), transfers)
  })

  const onQuickPresetChange = (preset: TransactionQuickPreset) => {
    setSearchCommand(previous => normalizeFilterState(applyQuickPreset(previous, preset, transfers), transfers))
    setSelectedSavedFilterId("")
  }

  const onClearFilters = () => {
    setSearchCommand(previous => ({
      ...normalizeFilterState(clearMutableFilters(previous), transfers),
      type: transfers ? 'TRANSFER' : undefined,
      offset: 0
    }))
    setSelectedSavedFilterId("")
  }

  const activeFilterChips: ActiveFilterChip[] = []
  if (searchCommand.account) {
    activeFilterChips.push({
      id: "account",
      label: `${ i10n('page.transactions.filter.account') }: ${ displayFilterValue(searchCommand.account) }`
    })
  }
  if (searchCommand.category) {
    activeFilterChips.push({
      id: "category",
      label: `${ i10n('page.transactions.filter.category') }: ${ displayFilterValue(searchCommand.category) }`
    })
  }
  if (searchCommand.budget) {
    activeFilterChips.push({
      id: "budget",
      label: `${ i10n('page.transactions.filter.budget') }: ${ displayFilterValue(searchCommand.budget) }`
    })
  }
  if (searchCommand.description) {
    activeFilterChips.push({
      id: "description",
      label: `${ i10n('page.transaction.filter.description') }: ${ searchCommand.description }`
    })
  }
  if (searchCommand.currency) {
    activeFilterChips.push({
      id: "currency",
      label: `${ i10n('page.transaction.filter.currency') }: ${ searchCommand.currency }`
    })
  }
  if (searchCommand.uncategorized) {
    activeFilterChips.push({
      id: "uncategorized",
      label: i10n('page.transactions.filters.preset.uncategorized')
    })
  }
  if (!transfers && (searchCommand.type === 'INCOME' || (searchCommand.onlyIncome && !searchCommand.onlyExpenses))) {
    activeFilterChips.push({
      id: "onlyIncome",
      label: i10n('page.transactions.filters.preset.income')
    })
  }
  if (!transfers && (searchCommand.type === 'EXPENSE' || (searchCommand.onlyExpenses && !searchCommand.onlyIncome))) {
    activeFilterChips.push({
      id: "onlyExpenses",
      label: i10n('page.transactions.filters.preset.expenses')
    })
  }

  const onRemoveFilterChip = (filterKey: string) => {
    setSearchCommand(previous => {
      const next: Record<string, any> = { ...previous, offset: 0 }
      delete next[filterKey]
      if (filterKey === "onlyIncome" || filterKey === "onlyExpenses") {
        delete next.onlyIncome
        delete next.onlyExpenses
        if (!transfers) delete next.type
      }
      return normalizeFilterState(next, transfers)
    })
    setSelectedSavedFilterId("")
  }

  const currentPreset: TransactionQuickPreset = searchCommand.uncategorized
    ? "uncategorized"
    : !transfers && (searchCommand.type === "INCOME" || (searchCommand.onlyIncome && !searchCommand.onlyExpenses))
      ? "income"
      : !transfers && (searchCommand.type === "EXPENSE" || (searchCommand.onlyExpenses && !searchCommand.onlyIncome))
        ? "expenses"
        : "all"

  const availablePresets = transfers ? TRANSFER_QUICK_PRESETS : QUICK_PRESETS

  const applySavedFilter = (savedFilterId: string) => {
    setSelectedSavedFilterId(savedFilterId)
    if (!savedFilterId) return
    const selectedView = savedFilterViews.find(view => view.id === savedFilterId)
    if (!selectedView) return

    setSearchCommand(previous => normalizeFilterState({
      ...clearMutableFilters(previous),
      ...selectedView.filters,
      type: transfers ? 'TRANSFER' : selectedView.filters.type,
      offset: 0
    }, transfers))
  }

  const saveCurrentFilters = (name: string) => {
    if (!name) return
    const filters = pickMutableFilters(searchCommand)
    const id = `${ Date.now() }-${ Math.random().toString(36).slice(2, 8) }`
    setSavedFilterViews(previous => [...previous, { id, name, filters }])
    setSelectedSavedFilterId(id)
  }

  const renameSavedFilter = (updatedName: string) => {
    const selectedView = savedFilterViews.find(view => view.id === selectedSavedFilterId)
    if (!selectedView) return
    if (!updatedName) return
    setSavedFilterViews(previous => previous.map(view => view.id === selectedSavedFilterId
      ? { ...view, name: updatedName }
      : view))
  }

  const deleteSavedFilter = () => {
    setSavedFilterViews(previous => previous.filter(view => view.id !== selectedSavedFilterId))
    setSelectedSavedFilterId("")
  }

  const openSaveDialog = () => {
    setSaveViewName("")
    setSaveDialogVisible(true)
  }

  const openRenameDialog = () => {
    const selectedView = savedFilterViews.find(view => view.id === selectedSavedFilterId)
    if (!selectedView) return
    setRenameViewName(selectedView.name)
    setRenameDialogVisible(true)
  }

  const openDeleteDialog = () => {
    if (!selectedSavedFilterId) return
    setDeleteDialogVisible(true)
  }

  const isLoaded = transactions !== undefined
  const hasTransactions = transactions && Object.keys(transactions).length > 0
  const showPagination = pagination && pagination?.records > pagination?.pageSize

  return <>
    <TransactionFilters onChange={ onFilterChange } activeFilter={ searchCommand } transfers={ transfers }/>

    <div className='flex flex-col lg:flex-row lg:justify-between gap-3 max-w-[90em] mx-auto px-2 mb-4'>
      <div className='flex flex-wrap gap-2 items-center'>
        { availablePresets.map(preset => <Button key={ preset }
                                                 type='button'
                                                 outlined={ currentPreset !== preset }
                                                 severity={ currentPreset === preset ? 'info' : 'secondary' }
                                                 className='text-sm'
                                                 label={ `page.transactions.filters.preset.${ preset }` }
                                                 onClick={ () => onQuickPresetChange(preset) }/>) }
      </div>

      <div className='flex gap-3 items-center'>
        <div className='flex flex-wrap gap-2 items-center'>
          { activeFilterChips.length > 0 && <>
            <span className='text-sm text-muted'>{ i10n('page.transactions.filters.active') }</span>
            { activeFilterChips.map(chip => <button key={ chip.id }
                                                    type='button'
                                                    className='rounded-full border border-blue-300/60 bg-blue-50/70 px-3 py-1 text-sm text-blue-700 hover:bg-blue-100'
                                                    onClick={ () => onRemoveFilterChip(chip.id) }>
              { chip.label } &times;
            </button>) }
            <Button type='button'
                    outlined
                    severity='secondary'
                    label='page.transactions.filters.reset'
                    onClick={ onClearFilters }/>
          </> }
        </div>

        <div className='hidden xl:flex flex-wrap gap-2 items-center'>
          <span className='text-sm text-muted'>{ i10n('page.transactions.filters.saved.label') }</span>
          <select className='p-2 border border-separator rounded-md bg-surface min-w-[16rem]'
                  value={ selectedSavedFilterId }
                  onChange={ (event) => applySavedFilter(event.target.value) }>
            <option value=''>{ i10n('page.transactions.filters.saved.placeholder') }</option>
            { savedFilterViews.map(view => <option key={ view.id } value={ view.id }>{ view.name }</option>) }
          </select>
          <Button type='button'
                  text
                  severity='secondary'
                  icon='mdi:content-save-outline'
                  tooltip={ i10n('page.transactions.filters.saved.save') }
                  aria-label={ i10n('page.transactions.filters.saved.save') }
                onClick={ openSaveDialog }/>
          <Button type='button'
                  text
                  severity='secondary'
                  icon='mdi:rename-outline'
                  tooltip={ i10n('page.transactions.filters.saved.rename') }
                  aria-label={ i10n('page.transactions.filters.saved.rename') }
                  disabled={ !selectedSavedFilterId }
                onClick={ openRenameDialog }/>
          <Button type='button'
                  text
                  severity='danger'
                  icon='mdi:trash-can-outline'
                  tooltip={ i10n('page.transactions.filters.saved.delete') }
                  aria-label={ i10n('page.transactions.filters.saved.delete') }
                  disabled={ !selectedSavedFilterId }
                onClick={ openDeleteDialog }/>
        </div>
      </div>
    </div>

    { !isLoaded && <Loading/> }

    { loadError && <div className='mx-2 my-4 p-4 border border-warning rounded-md bg-warning/10 flex flex-col gap-2'>
      <h3 className='font-semibold text-warning'>{ i10n('page.transactions.list.error.title') }</h3>
      <p className='text-sm text-warning'>{ i10n(loadError) }</p>
      <div>
        <Button type='button'
                outlined
                severity='secondary'
                label='common.action.retry'
                onClick={ () => setSearchCommand(previous => ({ ...previous })) }/>
      </div>
    </div> }

    { hasTransactions && Object.keys(transactions).map(key => {
      const date = new Date(key)
      const expense = transactions[key]
        .filter(t => Resolver.Transaction.isCredit(t))
        .reduce((a, t) => a - t.amount, 0)
      const income = transactions[key]
        .filter(t => Resolver.Transaction.isDebit(t))
        .reduce((a, t) => a + t.amount, 0)

      return <div key={ key } className='flex flex-col gap-0.5 pb-3'>
        <div
          className='flex gap-2 items-center border-b py-2 mb-2 px-2 md:rounded-lg bg-blue-300/10 md:bg-blue-200/20'>
          <div className='font-bold text-[1.25em] text-muted'>
            { date.getDate() }
          </div>
          <div className='rounded-sm bg-gray-300 text-[.75em] text-white text-center font-bold px-1 py-0.25'>
            { i10n(`common.weekday.${ date.getDay() }`) }
          </div>
          <span className='text-xs text-muted'>{ date.getFullYear() }.{ date.getMonth() + 1 }</span>
          { !transfers && <>
            <div className='flex-1 justify-end flex gap-16 font-bold'>
              { income !== 0 && <MoneyComponent money={ income }/> }
              { expense !== 0 && <MoneyComponent money={ expense }/> }
              { expense === 0 && <div/> }
            </div>
          </> }
        </div>
        { transactions[key].map(transaction =>
          <TransactionItem key={ transaction.id }
                           transaction={ transaction }/>) }
      </div>
    }) }

    { isLoaded && !loadError && !hasTransactions && <div className='mx-2 my-4 p-6 border border-separator rounded-md text-center bg-surface-100/40'>
      <h3 className='text-lg font-semibold text-muted mb-1'>{ i10n('page.transactions.list.empty.title') }</h3>
      <p className='text-sm text-muted'>{ i10n('page.transactions.list.empty.body') }</p>
    </div> }

    <Dialog
      header={ i10n('page.transactions.filters.saved.save') }
      visible={ saveDialogVisible }
      onHide={ () => setSaveDialogVisible(false) }
      className='w-[90vw] max-w-lg'
      dismissableMask>
      <div className='flex flex-col gap-3'>
        <label className='text-sm text-muted' htmlFor='save-filter-name'>{ i10n('page.transactions.filters.saved.prompt') }</label>
        <input
          id='save-filter-name'
          className='p-2 border border-separator rounded-md'
          value={ saveViewName }
          onChange={ event => setSaveViewName(event.target.value) }
          placeholder={ i10n('page.transactions.filters.saved.placeholder') }/>
        <div className='flex justify-end gap-2'>
          <Button type='button' outlined severity='secondary' label='common.action.cancel' onClick={ () => setSaveDialogVisible(false) }/>
          <Button type='button' label='common.action.save' onClick={ () => {
            saveCurrentFilters(saveViewName.trim())
            setSaveDialogVisible(false)
          } }/>
        </div>
      </div>
    </Dialog>

    <Dialog
      header={ i10n('page.transactions.filters.saved.rename') }
      visible={ renameDialogVisible }
      onHide={ () => setRenameDialogVisible(false) }
      className='w-[90vw] max-w-lg'
      dismissableMask>
      <div className='flex flex-col gap-3'>
        <label className='text-sm text-muted' htmlFor='rename-filter-name'>{ i10n('page.transactions.filters.saved.rename.prompt') }</label>
        <input
          id='rename-filter-name'
          className='p-2 border border-separator rounded-md'
          value={ renameViewName }
          onChange={ event => setRenameViewName(event.target.value) }/>
        <div className='flex justify-end gap-2'>
          <Button type='button' outlined severity='secondary' label='common.action.cancel' onClick={ () => setRenameDialogVisible(false) }/>
          <Button type='button' label='common.action.save' onClick={ () => {
            renameSavedFilter(renameViewName.trim())
            setRenameDialogVisible(false)
          } }/>
        </div>
      </div>
    </Dialog>

    <Dialog
      header={ i10n('page.transactions.filters.saved.delete') }
      visible={ deleteDialogVisible }
      onHide={ () => setDeleteDialogVisible(false) }
      className='w-[90vw] max-w-lg'
      dismissableMask>
      <div className='flex flex-col gap-4'>
        <p className='text-sm'>{ i10n('page.transactions.filters.saved.delete.confirm') }</p>
        <div className='flex justify-end gap-2'>
          <Button type='button' outlined severity='secondary' label='common.action.cancel' onClick={ () => setDeleteDialogVisible(false) }/>
          <Button type='button' severity='danger' label='common.action.delete' onClick={ () => {
            deleteSavedFilter()
            setDeleteDialogVisible(false)
          } }/>
        </div>
      </div>
    </Dialog>

    { showPagination && <Paginator totalRecords={ pagination.records }
                                   rows={ pagination.pageSize }
                                   first={ (parseInt( page ) - 1) * (pagination?.pageSize || 10) }
                                   onPageChange={ (e) => navigate(`?page=${ e.page + 1 }`) }/> }
  </>
}

export default TransactionOverview
