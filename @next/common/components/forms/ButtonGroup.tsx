import type { DetailedHTMLProps, HTMLAttributes } from 'react'
import { joinClassNames } from '@sujin/share/utils/string'
/* Assets */
// import '@common/scss/form.scss'

type Props = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
    readonly gap?: boolean
}

const ButtonGroup = ({ gap = false, children, ...props }: Props) => {
    const classNames = joinClassNames(props.className, 'button--group', gap && 'button--group__gap')
    return (
        <div className={classNames} {...props}>
            {children}
        </div>
    )
}
export default ButtonGroup
