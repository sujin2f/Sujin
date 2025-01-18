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
        console.log(1, ref.current, chart)
        if (ref.current && !chart) {
            console.log(2, ref.current.getAttribute('data-assigned'))
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
            console.log(ref.current.getContext('2d')?.canvas.dataset.assigned)
            if (ref.current.getContext('2d')) {
                // ;(ref.current.getContext('2d') as unknown as ChartJS).destroy()
            }

            const newChart = new ChartJS(ref.current, {
                type: 'line',
                data: {
                    datasets,
                    labels: map(columns, (_, index) => index + 1),
                },
            })

            setChart(newChart)
        }

        return () => {
            if (chart) {
                chart.destroy()
            }
        }
    }, [chart, columns, data])

    return <canvas className="chart" ref={ref} />
}
