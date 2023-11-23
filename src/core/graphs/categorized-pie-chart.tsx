import {FC, useEffect, useState} from "react";
import {useDateRange} from "../hooks";
import {Layout} from "../index";
import {isArray} from "chart.js/helpers";
import {defaultGraphColors} from "../Chart";
import {Account} from "../types";
import StatisticalRepository from "../repositories/statistical-repository";
import {Chart} from "react-chartjs-2";
import {ChartData} from "chart.js";

type CategorizedPieChartProps = {
    id: string
    split: 'category' | 'budget'
    incomeOnly: boolean,
    accounts?: Account[] | Account
}

const CategorizedPieChart: FC<CategorizedPieChartProps> = ({ id, split, incomeOnly, accounts = [] }) => {
    const [pieSeries, setPieSeries] = useState<ChartData | undefined>(undefined)
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
                    labels: series.map(({partition}) => partition || 'Uncategorized'),
                    datasets: [
                        {
                            data: series.map(({balance}) => Math.abs(balance))
                        }
                    ]
                })
            })
    }, [split, incomeOnly, range]) // eslint-disable-line react-hooks/exhaustive-deps

    if (!pieSeries) return <Layout.Loading />
    return <>
        <Chart id={ id }
               type='pie'
               height={ 300 }
               data={ pieSeries }
               options={
                  {
                      elements: {
                          arc: {
                              backgroundColor: (context : any) => defaultGraphColors[context.dataIndex]
                          }
                      },
                      plugins: {
                          legend: {
                              display: true,
                              position: 'right'
                          },
                          tooltip: {
                              callbacks: {
                                  title: (context : any) => context.label,
                                  label: (context: any) => {
                                      if (accounts && !isArray(accounts)) {
                                          return `${context.raw} ${accounts?.account?.currency}`
                                      }

                                      return context.raw
                                  }
                              }
                          }
                      },
                      maintainAspectRatio: false
                  }}/>
    </>
}

export default CategorizedPieChart