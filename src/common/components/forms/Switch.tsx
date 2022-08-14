import React, {
    Fragment,
    CSSProperties,
    forwardRef,
    ForwardedRef,
    ChangeEvent,
} from 'react'

type Props = {
    id: string
    checked?: boolean
    title?: string
    style?: CSSProperties
    onChange?: (value: boolean) => void
}
export const Switch = forwardRef(
    (props: Props, ref: ForwardedRef<HTMLInputElement>): JSX.Element => {
        const { id, checked, title, style } = props

        const onChange = (e: ChangeEvent<HTMLInputElement>) => {
            if (props.onChange) {
                props.onChange(!!e.target.value)
            }
        }

        return (
            <Fragment>
                <input
                    className="switch-input"
                    id={id}
                    ref={ref}
                    type="checkbox"
                    checked={checked}
                    onChange={onChange}
                />
                <label className="switch-paddle" htmlFor={id} style={style}>
                    <span className="show-for-sr">
                        <span className="hidden">{title}</span>
                    </span>
                </label>
            </Fragment>
        )
    },
)
