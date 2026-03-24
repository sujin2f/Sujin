'use client'
import { CSSProperties, RefObject, useState, useMemo, useCallback } from 'react'

type Props = {
    id?: string
    checked?: boolean
    title?: string
    style?: CSSProperties
    onChange?: (value: boolean) => void
    ref?: RefObject<HTMLInputElement>
}

export const Switch = ({
    id,
    title,
    style,
    ref,
    onChange: onChangeCallback,
    ...props
}: Props) => {
    const [checked, setChecked] = useState(props.checked)

    const onChange = useCallback(
        (checked: boolean) => {
            setChecked(checked)
            if (onChangeCallback) {
                onChangeCallback(checked)
            }
        },
        [onChangeCallback],
    )

    const className = useMemo(() => (checked ? 'switch--on' : ''), [checked])

    return (
        <label
            className={`switch ${className}`}
            style={style}
            aria-label={title}
        >
            <input
                className="switch__input"
                type="checkbox"
                id={id}
                ref={ref}
                onChange={() => onChange(!checked)}
                defaultChecked={checked}
            />
            <span className="switch__paddle" />
        </label>
    )
}

export default Switch
