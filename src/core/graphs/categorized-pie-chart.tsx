import {FC, useEffect, useState} from "react";
import {useDateRange} from "../hooks";
import {Charts, Layout, Statistical} from "../index";
import {isArray} from "chart.js/helpers";
import {defaultGraphColors} from "../Chart";
import {Account} from "../types";
import {Datasets} from "./chart-types";

type CategorizedPieChartProps = {
    id: string
    split: 'category' | 'budget'
    incomeOnly: boolean,
    accounts?: Account[] | Account
}

const CategorizedPieChart: FC<CategorizedPieChartProps> = ({ id, split, incomeOnly, accounts = [] }) => {
    const [pieSeries, setPieSeries] = useState<Datasets>(undefined)
    const [labels, setLabels] = useState<string[]>([])
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

        Statistical.Service.split(split, searchCommand)
            .then(series => {
                setLabels(series.map(({partition}: any) => partition || 'Uncategorized'))
                setPieSeries([{
                    label: split,
                    data: series.map(({balance}: any) => Math.abs(balance))
                }])
                series.filter((point: any) => point.balance !== 0)
            })
    }, [split, incomeOnly, range])

    if (!pieSeries) return <Layout.Loading />
    return <>
        <Charts.Chart id={ id }
                      type='pie'
                      height={ 300 }
                      labels={ labels }
                      data={ pieSeries }
                      options={{
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