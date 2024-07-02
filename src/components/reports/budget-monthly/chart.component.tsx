import { Chart } from "react-chartjs-2";
import { DefaultChartConfig, Service } from "../../../config/global-chart-config";
import React from "react";
import { ChartData } from "chart.js";

const BudgetChart = ({ dataSet, currencySymbol = '' } : { dataSet: ChartData, currencySymbol: string }) => {
    return  <Chart type='line'
                   height={ 300 }
                   options={ Service.mergeOptions(DefaultChartConfig.line,{
                       scales: {
                           x: {
                               time: {
                                   unit: 'month'
                               }
                           },
                           y: {
                               ticks: {
                                   callback: (value: any) => `${currencySymbol}${value}`
                               }
                           }
                       },
                       plugins: {
                           legend: {
                               display: true
                           }
                       }
                   }) }
                   data={ dataSet } />
}

export default BudgetChart