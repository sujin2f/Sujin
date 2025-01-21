'use client'
/* Components */
import { Chart } from '@components/(ether)/chart'
import { Table } from '@components/(ether)/table'
import { ScrollToTop } from '@components/ScrollToTop'
/* Helpers */
import type { ChartData, TableData } from '@src/types/ether'
import { Row } from '@common/components/layout/Row'
import { Column } from '@common/components/layout/Column'

type Props = {
    chartData: ChartData
    tableData: TableData
    rowHead: string[]
    maxColumn: number
}

export const Data = ({ chartData, tableData, rowHead, maxColumn }: Props) => {
    return (
        <>
            <ScrollToTop />
            <Row>
                <Column small={12}>
                    <Chart data={chartData} />
                </Column>
            </Row>
            <Row fullWidth>
                <Column small={12}>
                    <Table
                        data={tableData}
                        rowHead={rowHead}
                        maxColumn={maxColumn}
                    />
                </Column>
            </Row>
        </>
    )
}
