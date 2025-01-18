import { ChartOptions } from 'chart.js/auto'

export const chartColors = [
    '#FF6699',
    '#FF9933',
    '#FFCC66',
    '#66CCCC',
    '#3399CC',
    '#9966FF',
    '#CCCCCC',
]

export const options: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top' as const,
        },
    },
    scales: {
        y: {
            beginAtZero: true,
            ticks: {
                stepSize: 0.01,
            },
        },
    },
}
