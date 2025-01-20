'use client'

import { map } from '@common/utils/array'
import { getRandomInt } from '@common/utils/number'
import { chartColors } from '@src/constants/chart'
import { ChartData } from '@src/types/ether'
import { Chart as ChartJS, ChartDataset } from 'chart.js/auto'
import { useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

type Props = { data: ChartData }

export const Chart = ({ data }: Props) => {
    const searchParams = useSearchParams()
    const term = searchParams && searchParams.get('term')
    const ref = useRef<HTMLCanvasElement>(null)
    const [chart, setChart] = useState<ChartJS>()

    useEffect(() => {
        if (ref.current && !chart && !ChartJS.getChart('chart-container')) {
            const maxColumn = Math.max(
                ...Object.values(data).map((row) => row.length),
            )

            const datasets = Object.entries(data)
                .filter(([key]) => (term ? key.indexOf(term) !== -1 : true))
                .map(([label, data], index) => {
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
                })

            setChart(
                new ChartJS(ref.current, {
                    type: 'line',
                    data: {
                        datasets,
                        labels: map(maxColumn, (_, index) => index + 1),
                    },
                }),
            )
        }
    }, [chart, data, term])

    return <canvas id="chart-container" className="chart" ref={ref} />
}
