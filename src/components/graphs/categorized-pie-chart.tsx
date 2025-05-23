import { FC, useEffect, useState } from "react";
import useDateRange from "../../hooks/date-range.hook";
import { isArray } from "chart.js/helpers";
import { Account } from "../../types/types";
import { Chart } from 'primereact/chart';
import StatisticalRepository from "../../core/repositories/statistical-repository";
import { ChartData, Tooltip, TooltipPosition } from "chart.js";
import { defaultGraphColors } from "../../config/global-chart-config";

import Loading from "../layout/loading.component";

type CategorizedPieChartProps = {
    id: string
    split: 'category' | 'budget'
    incomeOnly: boolean,
    accounts?: Account[] | Account
}

let lastPosition: TooltipPosition
(Tooltip.positioners as any)['center'] = (_: any[], eventPosition: any) => {
    const chartArea = eventPosition.chart?.chartArea
    if (!chartArea) return lastPosition

    lastPosition = { x: chartArea.right / 2 - 40, y: chartArea.bottom / 2 }
    return lastPosition
}

const CategorizedPieChart: FC<CategorizedPieChartProps> = ({ id, split, incomeOnly, accounts }) => {
    const [pieSeries, setPieSeries] = useState<ChartData<'doughnut'> | undefined>(undefined)
    const [range] = useDateRange()

    useEffect(() => {
        setPieSeries(undefined)

        const searchCommand = {
            dateRange: {
                start: range.startString(),
                end: range.endString()
            },
            onlyIncome: incomeOnly,
            accounts: Array.isArray(accounts) ? accounts : (accounts ? [accounts] : undefined)
        }

        StatisticalRepository.split(split, searchCommand)
            .then(series => {
                series = series.filter(({ balance }) => balance !== 0)
                setPieSeries({
                    labels: series.map(({ partition }) => partition || 'Uncategorized'),
                    datasets: [
                        {
                            data: series.map(({ balance }) => Math.abs(balance))
                        }
                    ]
                })
            })
    }, [split, incomeOnly, range.toString()])

    const currency = accounts && !isArray(accounts) ? accounts.account.currency : '€'

    if (!pieSeries) return <Loading />
    return <>
        <Chart id={ id }
               type='doughnut'
               className='w-full'
               data={ pieSeries }
               options={
                  {
                      cutout: '65%',
                      elements: {
                          arc: {
                              hoverOffset: 15,
                              borderWidth: .5,
                              backgroundColor: (context : any) => defaultGraphColors[context.dataIndex]
                          }
                      },
                      plugins: {
                          legend: {
                              display: false,
                          },
                          tooltip: {
                              backgroundColor: 'white',
                              bodyColor: 'black',
                              titleColor: 'black',
                              cornerRadius: 0,
                              caretSize: 0,
                              position: 'center',
                              bodyAlign: 'left',
                              callbacks: {
                                  title: (context : any) => context.label,
                                  label: (context: any) => {
                                      return ` ${currency}${context.raw}`
                                  }
                              }
                          }
                      },
                      maintainAspectRatio: false
                  } as any }/>
    </>
}

export default CategorizedPieChart
