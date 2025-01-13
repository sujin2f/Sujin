import React, {
    Fragment,
    CSSProperties,
    RefObject,
    ChangeEvent,
    useCallback,
} from 'react'

type Props = {
    id: string
    checked?: boolean
    title?: string
    style?: CSSProperties
    onChange?: (value: boolean) => void
    ref?: RefObject<HTMLInputElement>
}

export const Switch = (props: Props) => {
    const { id, checked, title, style, ref } = props

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
            <label
                className="switch-paddle"
                htmlFor={id}
                style={style}
                aria-label={title}
            >
                <span className="show-for-sr">
                    <span className="hidden">{title}</span>
                </span>
            </label>
        </Fragment>
    )
}
