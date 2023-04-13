const deepMerge = (left, right) => {
    const result = {};

    for (const key in right) {
        if (right.hasOwnProperty(key)) {
            if (right[key] instanceof Function) {
                result[key] = right[key];
            } else if (right[key] instanceof Object) {
                result[key] = Object.assign({}, right[key]);
            } else {
                result[key] = right[key];
            }
        }
    }

    for (const key in left) {
        if (left.hasOwnProperty(key)) {
            if (left[key] instanceof Function) {
                result[key] = left[key];
            } else if (left[key] instanceof Object) {
                result[key] = deepMerge(result[key] || {}, left[key]);
            } else {
                result[key] = left[key];
            }
        }
    }

    return result;
}

const GlobalChartConfig = {
    font: {
        family: 'Helvetica',
        size: 12
    },
    responsive: true,
    maintainAspectRatio: false,
    animation: {
        active: true,
        easing: 'easeOutQuart'
    },
    scales: {
        x: {
            grid: {
                display: false
            }
        },
        y: {
            type: 'linear',
            beginAtZero: true,
            title: {
                display: true
            },
            ticks: {}
        }
    },
    plugins: {
        tooltip: {
            enabled: true,
            usePointStyle: true,
            position: 'nearest',
            callbacks: {
                labelPointStyle: (_) => {
                    return {
                        pointStyle: 'triangle',
                        rotation: 0
                    };
                }
            }
        },
        legend: {
            display: false,
            position: 'bottom',
            labels: {
                usePointStyle: true,
                pointStyle: 'line'
            }
        }
    }
}

const DELAY_BETWEEN_POINTS = 1000 / 31
const LineGraphOptions = deepMerge({
    animation: {
        x: {
            type: 'number',
            easing: 'linear',
            duration: DELAY_BETWEEN_POINTS,
            from: NaN, // the point is initially skipped
            delay(ctx) {
                if (ctx.type !== 'data' || ctx.xStarted) {
                    return 0;
                }
                ctx.xStarted = true;
                return ctx.index * DELAY_BETWEEN_POINTS;
            }
        },
        y: {
            type: 'number',
            easing: 'linear',
            duration: DELAY_BETWEEN_POINTS,
            from: (ctx) => {
                if (ctx.index === 0) {
                    return ctx.chart.scales.y.getPixelForValue(100);
                } else {
                    return ctx.chart.getDatasetMeta(ctx.datasetIndex).data[ctx.index - 1].getProps(['y'], true).y
                }
            },
            delay(ctx) {
                if (ctx.type !== 'data' || ctx.yStarted) {
                    return 0;
                }
                ctx.yStarted = true;
                return ctx.index * DELAY_BETWEEN_POINTS;
            }
        }
    },
    scales: {
        x: {
            type: 'time',
            time: {
                tooltipFormat: 'yyyy-MM-dd'
            },
            title: {
                display: true
            },
        },
        y: {
            grid: {
                color: ctx => ctx.tick.value < 0 ? '#ff638450' : '#00000030'
            },
            ticks: {
                color: ctx => ctx.tick.value < 0 ? '#E5052E' : '#000000'
            }
        }
    }
}, GlobalChartConfig)

const BarGraphOptions = deepMerge({
    scales: {
        y: {
            suggestedMax: 100,
            ticks: {
                precision: 0
            }
        }
    }
}, GlobalChartConfig)

const PieGraphOptions = {
    plugins: {
        legend: {
            display: false
        },
        tooltip: {
            usePointStyle: true,
            callbacks: {
                labelPointStyle: (_) => {
                    return {
                        pointStyle: 'triangle',
                        rotation: 0
                    };
                }
            }
        }
    }
}

const DefaultChartConfig = {
    line: LineGraphOptions,
    pie: PieGraphOptions,
    bar: BarGraphOptions
}

const Service = {
    mergeOptions: deepMerge
}

export {
    GlobalChartConfig,
    DefaultChartConfig,
    Service
}
