'use client'
import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import {
    Chart as ChartJS,
    type ChartDataset,
    type ChartData as ChartJSData,
} from 'chart.js/auto'
/* Helpers */
import { getRandomInt } from '@sujin/common/utils/number'
import { CHART_COLORS } from '@app/ether/data/constants'
import { ChartData } from '@app/ether/data/types' // @todo Name
import { map } from '@sujin/common/utils/array'

type Props = { data: ChartData }

const convertChartData = (
    data: ChartData,
    term?: string,
): ChartJSData<'line'> => {
    const maxColumn = Math.max(...Object.values(data).map((row) => row.length))
    const datasets = Object.entries(data)
        .filter(([key]) => (term ? key.indexOf(term) !== -1 : true))
        .map(([label, data], index) => {
            return {
                label,
                data,
                fill: false,
                borderColor:
                    CHART_COLORS[index] ||
                    `rgb(${getRandomInt(256)}, ${getRandomInt(
                        256,
                    )}, ${getRandomInt(256)})`,
                tension: 0,
            } as ChartDataset<'line'>
        })
    const labels = map(maxColumn, (_, index) => index + 1)

    return { datasets, labels }
}

export const Chart = ({ data }: Props) => {
    const searchParams = useSearchParams() // @todo Changed
    const term = (searchParams && searchParams.get('term')) || undefined
    const ref = useRef<HTMLCanvasElement>(null)
    const [chart, setChart] = useState<ChartJS>()

    useEffect(() => {
        if (ref.current && !chart && !ChartJS.getChart('chart-container')) {
            setChart(
                new ChartJS(ref.current, {
                    type: 'line',
                    data: convertChartData(data, term),
                }),
            )
        } else if (ref.current && chart) {
            chart.data = convertChartData(data, term)
            chart.update()
        }
    }, [chart, data, term])

    return <canvas id="chart-container" className="chart" ref={ref} />
}
