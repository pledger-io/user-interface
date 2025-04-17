import Icon from "@mdi/react";
import { Card } from "primereact/card";
import React, { FC, useEffect, useState } from "react";
import MoneyComponent from "../format/money.component";
import { i10n } from "../../config/prime-locale";

type SummaryComponentProps = {
  title: string,
  icon: any,
  currency: string,
  currentPromise?: Promise<number>,
  previousPromise?: Promise<number>
}

const ComparisonData = {
  up: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' style='width:24px;height:24px' viewBox='0 0 24 24'%3E%3Cpath fill='%2393dccc' d='M13,18V10L16.5,13.5L17.92,12.08L12,6.16L6.08,12.08L7.5,13.5L11,10V18H13M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2Z' /%3E%3C/svg%3E"
  },
  down: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' style='width:24px;height:24px' viewBox='0 0 24 24'%3E%3Cpath fill='%23e77e94' d='M11,6V14L7.5,10.5L6.08,11.92L12,17.84L17.92,11.92L16.5,10.5L13,14V6H11M12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22Z' /%3E%3C/svg%3E"
  },
  same: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' style='width:24px;height:24px' viewBox='0 0 24 24'%3E%3Cpath fill='%23d3c9c9' d='M17,13H7V11H17M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z' /%3E%3C/svg%3E"
  }
}

type ComparisonType = keyof typeof ComparisonData

const SummaryComponent: FC<SummaryComponentProps> = ({ title, icon, currency, currentPromise, previousPromise }) => {
  const [current, setCurrent] = useState(0)
  const [previous, setPrevious] = useState(0)
  const [comparisonClass, setComparisonClass] = useState<ComparisonType>('same')
  const [comparisonKey, setComparisonKey] = useState('page.dashboard.summary.trend.same')

  useEffect(() => {
    if (currentPromise) currentPromise.then(setCurrent)
  }, [currentPromise])
  useEffect(() => {
    if (previousPromise) previousPromise.then(setPrevious)
  }, [previousPromise])

  useEffect(() => {
    if (current < previous) {
      setComparisonKey('page.dashboard.summary.trend.down')
      setComparisonClass('down')
    } else if (current > previous) {
      setComparisonKey('page.dashboard.summary.trend.up')
      setComparisonClass('up')
    }
  }, [current, previous])

  return <Card className='flex-1 my-0!'>
    <div className='flex flex-row justify-between'>
      <div className='min-w-[100px] min-h-[125px]'>
        <h1 className='text-2xl'>
          { i10n(title) }
        </h1>
        <span className='text-3xl'>
            <MoneyComponent money={ current } currency={ currency }/>
        </span>
        { previous !== null && (
          <div className={ `
                            bg-no-repeat flex items-center mt-2
                            whitespace-nowrap bg-left-bottom
                            text-sm` }
               style={ { lineHeight: '1.5rem' } }>
            <img src={ ComparisonData[comparisonClass].icon } className='w-8 h-8 mr-1' alt={ comparisonClass }/>
            { i10n(comparisonKey) }
          </div>
        ) }
      </div>
      { icon && <Icon path={ icon } className='w-[125px]'/> }
    </div>
  </Card>
}

export default SummaryComponent
