import { joinClassNames } from '@common/utils/string'
import type { DetailedHTMLProps, HTMLAttributes } from 'react'

type Props = DetailedHTMLProps<
    HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
> & {
    readonly color?: 'primary' | 'secondary' | 'success' | 'alert' | 'warning'
    readonly hollow?: boolean
    readonly vanilla?: boolean
    readonly href?: string
}

const ButtonGroup = ({ children, className, ...props }: Props) => {
    const classNames = joinClassNames(className, 'button--group')
    return (
        <div className={classNames} {...props}>
            {children}
        </div>
    )
}
export default ButtonGroup
