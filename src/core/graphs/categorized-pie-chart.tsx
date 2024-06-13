import { FC, useEffect, useState } from "react";
import { useDateRange } from "../hooks";
import { Layout } from "../index";
import { isArray } from "chart.js/helpers";
import { Account } from "../types";
import StatisticalRepository from "../repositories/statistical-repository";
import { Chart } from "react-chartjs-2";
import { ChartData, Tooltip, TooltipModel, TooltipPosition } from "chart.js";
import { defaultGraphColors } from "../../config/global-chart-config";

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

const CategorizedPieChart: FC<CategorizedPieChartProps> = ({ id, split, incomeOnly, accounts = [] }) => {
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
            accounts: Array.isArray(accounts) ? accounts : [accounts]
        }

        StatisticalRepository.split(split, searchCommand)
            .then(series => {
                setPieSeries({
                    labels: series.map(({ partition }) => partition || 'Uncategorized'),
                    datasets: [
                        {
                            data: series.map(({ balance }) => Math.abs(balance))
                        }
                    ]
                })
            })
    }, [split, incomeOnly, range]) // eslint-disable-line react-hooks/exhaustive-deps

    const currency = accounts && !isArray(accounts) ? accounts.account.currency : '€'

    if (!pieSeries) return <Layout.Loading />
    return <>
        <Chart id={ id }
               type='doughnut'
               height={ 300 }
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