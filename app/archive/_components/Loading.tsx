'use client'
/* Components */
import Row from '@common/components/layout/Row'
import Column, { type ColumnProps } from '@common/components/layout/Column'
/* Utils */
import { map } from '@common/utils/array'
import { joinClassNames } from '@common/utils/string'
/* Assets */
import '@app/archive/_components/loading.scss'

type Props = ColumnProps & {
    readonly className?: string
    readonly counts?: number
    readonly fullWidth?: boolean
}

export const Loading = ({
    small = 4,
    counts = 12,
    fullWidth = true,
    ...props
}: Props) => {
    const className = joinClassNames(
        props.className && `loader--${props.className}`,
    )
    return (
        <Row className={`loader ${className}`} fullWidth={fullWidth}>
            {map(counts, (_, index: number) => (
                <Column key={`${index}`} small={small} {...props}>
                    <div className="loader__animation" />
                </Column>
            ))}
        </Row>
    )
}
