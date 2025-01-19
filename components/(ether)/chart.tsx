'use client'

import { map } from '@common/utils/array'
import { getRandomInt } from '@common/utils/number'
import { chartColors } from '@src/constants/chart'
import { Chart as ChartJS, ChartDataset } from 'chart.js/auto'
import { useEffect, useRef, useState } from 'react'

export const Chart = ({
    data,
    columns,
}: {
    data: Record<string, number[]>
    columns: number
}) => {
    const ref = useRef<HTMLCanvasElement>(null)
    const [chart, setChart] = useState<ChartJS>()

    useEffect(() => {
        if (ref.current && !chart && !ChartJS.getChart('chart-container')) {
            const datasets = Object.entries(data).map(
                ([label, data], index) => {
                    return {
                        label,
                        data,
                        fill: false,
                        borderColor:
                            chartColors[index] ||
                            `rgb(${getRandomInt(256)}, ${getRandomInt(256)}, ${getRandomInt(
                                256,
                            )})`,
                        tension: 0,
                    } as ChartDataset<'line'>
                },
            )

            setChart(
                new ChartJS(ref.current, {
                    type: 'line',
                    data: {
                        datasets,
                        labels: map(columns, (_, index) => index + 1),
                    },
                }),
            )
        }

        return () => {
            if (chart) {
                chart.destroy()
            }
        }
    }, [chart, columns, data])

    return <canvas id="chart-container" className="chart" ref={ref} />
}
