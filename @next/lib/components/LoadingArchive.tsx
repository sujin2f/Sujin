'use client'
/* Components */
import Row from '@sujin/common/components/layout/Row'
import Column, {
    type ColumnProps,
} from '@sujin/common/components/layout/Column'
/* Utils */
import { map } from '@sujin/common/utils/array'
import { joinClassNames } from '@sujin/common/utils/string'
/* Assets */
import '@app/archive/_components/Loading.scss'

type Props = ColumnProps & {
    readonly className?: string
    readonly counts?: number
    readonly fullWidth?: boolean
}

export const LoadingArchive = ({
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
