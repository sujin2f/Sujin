import React, {
    Fragment,
    CSSProperties,
    forwardRef,
    ForwardedRef,
    ChangeEvent,
    useCallback,
} from 'react'

type Props = {
    id: string
    checked?: boolean
    title?: string
    style?: CSSProperties
    onChange?: (value: boolean) => void
}

/*
 * Switch Component in Foundation Site
 * @ref https://get.foundation/sites/docs/switch.html
 */
export const Switch = forwardRef(
    (props: Props, ref: ForwardedRef<HTMLInputElement>): JSX.Element => {
        const { id, checked, title, style } = props

        const onChange = useCallback(
            (e: ChangeEvent<HTMLInputElement>) => {
                if (props.onChange) {
                    props.onChange(!!e.target.value)
                }
            },
            [props],
        )

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
