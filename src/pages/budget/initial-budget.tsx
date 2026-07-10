import { Card } from "primereact/card";
import { Calendar } from "primereact/calendar";
import { InputNumber } from "primereact/inputnumber";
import { Message } from "primereact/message";
import React, { FormEvent, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import BreadCrumbItem from "../../components/breadcrumb/breadcrumb-item.component";
import BreadCrumbs from "../../components/breadcrumb/breadcrumb.component";
import { Button } from "../../components/layout/button";
import { i10n } from "../../config/prime-locale";
import { useNotification } from "../../context/notification-context";
import BudgetRepository from "../../core/repositories/budget.repository";

type WizardStep = 1 | 2 | 3

const monthStart = (date: Date): Date => new Date(date.getFullYear(), date.getMonth(), 1)

const isFutureMonth = (date: Date, today: Date): boolean =>
  monthStart(date).getTime() > monthStart(today).getTime()

const localeByLanguage: Record<string, string> = {
  en: "en-US",
  nl: "nl-NL",
  de: "de-DE"
}

const CreateBudgetView = () => {
  const navigate = useNavigate()
  const { warning, success } = useNotification()
  const [step, setStep] = useState<WizardStep>(1)
  const [startPeriod, setStartPeriod] = useState<Date | null>(null)
  const [income, setIncome] = useState<number | null>(null)
  const [stepErrorKey, setStepErrorKey] = useState<string>()
  const [submitErrorKey, setSubmitErrorKey] = useState<string>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [today, setToday] = useState(() => new Date())

  const locale = useMemo(() => {
    const language = (localStorage.getItem("language") || "en").replaceAll("\"", "")
    return localeByLanguage[language] || "en-US"
  }, [])

  const validateStartPeriod = (value: Date | null): string | undefined => {
    if (!value) return "page.budget.initial.wizard.validation.start.required"
    if (isFutureMonth(value, new Date())) return "page.budget.initial.wizard.validation.start.future"
    return undefined
  }

  const validateIncome = (value: number | null): string | undefined => {
    if (value == null) return "page.budget.initial.wizard.validation.income.required"
    if (value <= 0) return "page.budget.initial.wizard.validation.income.positive"
    return undefined
  }

  const validateCurrentStep = (nextStep: WizardStep): string | undefined => {
    if (nextStep === 1) return validateStartPeriod(startPeriod)
    if (nextStep === 2) return validateIncome(income)
    return undefined
  }

  const onNext = () => {
    setToday(new Date())
    const errorKey = validateCurrentStep(step)
    if (errorKey) {
      setStepErrorKey(errorKey)
      return
    }

    setStep(previous => Math.min(3, previous + 1) as WizardStep)
    setStepErrorKey(undefined)
    setSubmitErrorKey(undefined)
  }

  const onBack = () => {
    setStep(previous => Math.max(1, previous - 1) as WizardStep)
    setStepErrorKey(undefined)
    setSubmitErrorKey(undefined)
  }

  const onCancel = () => {
    if (isSubmitting) return
    navigate("/budgets")
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setToday(new Date())

    if (step !== 3) {
      onNext()
      return
    }

    const startError = validateStartPeriod(startPeriod)
    if (startError) {
      setStep(1)
      setStepErrorKey(startError)
      return
    }

    const incomeError = validateIncome(income)
    if (incomeError) {
      setStep(2)
      setStepErrorKey(incomeError)
      return
    }

    if (!startPeriod || income == null) return

    setStepErrorKey(undefined)
    setSubmitErrorKey(undefined)
    setIsSubmitting(true)

    BudgetRepository.create({
      year: startPeriod.getFullYear(),
      month: startPeriod.getMonth() + 1,
      income
    })
      .then(() => success("page.budget.group.created"))
      .then(() => navigate("/budgets"))
      .catch(() => {
        warning("page.budget.group.create.failed")
        setSubmitErrorKey("page.budget.initial.wizard.submit.error")
      })
      .finally(() => setIsSubmitting(false))
  }

  const header = () => <div className='px-2 py-2 border-b text-center font-bold'>
    { i10n("page.nav.budget.initial.setup") }
  </div>

  return <>
    <BreadCrumbs>
      <BreadCrumbItem label='page.nav.finances'/>
      <BreadCrumbItem label='page.nav.budget.groups'/>
      <BreadCrumbItem label='page.nav.budget.initial.setup'/>
    </BreadCrumbs>

    <Card header={ header } className='max-w-2xl mx-auto my-auto'>
      <form onSubmit={ onSubmit } className='flex flex-col gap-4'>
        <Message severity='info' text={ i10n("page.budget.group.explained") }/>

        <div className='flex flex-wrap gap-2'>
          <div className={ `rounded-md px-3 py-2 text-sm font-medium ${ step === 1 ? "bg-primary text-white" : "bg-surface-100 text-color" }` }>
            { i10n("page.budget.initial.wizard.step.start") }
          </div>
          <div className={ `rounded-md px-3 py-2 text-sm font-medium ${ step === 2 ? "bg-primary text-white" : "bg-surface-100 text-color" }` }>
            { i10n("page.budget.initial.wizard.step.income") }
          </div>
          <div className={ `rounded-md px-3 py-2 text-sm font-medium ${ step === 3 ? "bg-primary text-white" : "bg-surface-100 text-color" }` }>
            { i10n("page.budget.initial.wizard.step.review") }
          </div>
        </div>

        { step === 1 && <div className='flex flex-col gap-2'>
          <label htmlFor='startPeriod' className='font-bold'>
            { i10n("page.budget.initial.wizard.startPeriod") } *
          </label>
          <Calendar id='startPeriod'
                    showIcon
                    view='month'
                    maxDate={ today }
                    dateFormat='mm/yy'
                    value={ startPeriod }
                    disabled={ isSubmitting }
                    onFocus={ () => setToday(new Date()) }
                    onChange={ event => {
                      setStartPeriod((event.value as Date | null) || null)
                      setStepErrorKey(undefined)
                    }}/>
        </div> }

        { step === 2 && <div className='flex flex-col gap-2'>
          <label htmlFor='expectedIncome' className='font-bold'>
            { i10n("Budget.expectedIncome") } *
          </label>
          <InputNumber id='expectedIncome'
                       mode='currency'
                       currency='EUR'
                       minFractionDigits={ 2 }
                       maxFractionDigits={ 2 }
                       value={ income }
                       disabled={ isSubmitting }
                       onChange={ event => {
                         setIncome(event.value ?? null)
                         setStepErrorKey(undefined)
                       }}/>
        </div> }

        { step === 3 && <div className='flex flex-col gap-3'>
          <h3 className='m-0 text-lg font-bold'>{ i10n("page.budget.initial.wizard.review.title") }</h3>
          <div className='rounded-md border border-surface-200 p-3'>
            <div className='flex justify-between gap-4'>
              <span className='font-semibold'>{ i10n("page.budget.initial.wizard.review.startPeriod") }</span>
              <span>
                { startPeriod
                  ? startPeriod.toLocaleDateString(locale, { month: "long", year: "numeric" })
                  : "-" }
              </span>
            </div>
            <div className='mt-2 flex justify-between gap-4'>
              <span className='font-semibold'>{ i10n("page.budget.initial.wizard.review.expectedIncome") }</span>
              <span>
                { income != null
                  ? new Intl.NumberFormat(locale, { style: "currency", currency: "EUR" }).format(income)
                  : "-" }
              </span>
            </div>
          </div>
        </div> }

        { stepErrorKey && <small className='text-dark-warning'>{ i10n(stepErrorKey) }</small> }
        { step === 3 && submitErrorKey && <Message severity='error' text={ i10n(submitErrorKey) }/> }

        <div className='mt-2 flex flex-wrap justify-end gap-2'>
          <Button label='common.action.cancel'
                  type='button'
                  severity='secondary'
                  disabled={ isSubmitting }
                  onClick={ onCancel }/>

          { step > 1 && <Button label='common.action.back'
                                type='button'
                                severity='secondary'
                                disabled={ isSubmitting }
                                onClick={ onBack }/> }

          { step < 3 && <Button label='common.action.next'
                                type='button'
                                disabled={ isSubmitting }
                                onClick={ onNext }/> }

          { step === 3 && <Button label='page.budget.initial.wizard.action.submit'
                                  icon='mdi:content-save'
                                  type='submit'
                                  loading={ isSubmitting }
                                  disabled={ isSubmitting }/> }
        </div>
      </form>
    </Card>
  </>
}

export default CreateBudgetView
