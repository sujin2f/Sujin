'use client'
import Table from '@common/components/containers/Table'
import { map } from '@common/utils/array'

type Props = {
    readonly className?: string
    readonly fullWidth?: boolean
    readonly rows?: number
}

export const LoadingTable = ({
    className,
    fullWidth = true,
    rows = 12,
}: Props) => {
    return (
        <Table className={className} fullWidth={fullWidth}>
            {map(rows, (_, index) => (
                <tr key={`loader-${index}`}>
                    <td className="--loader--text"></td>
                </tr>
            ))}
        </Table>
    )
}
