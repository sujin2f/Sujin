import React, { CSSProperties, useState, RefObject, useCallback } from 'react'
import { SwatchesPicker } from 'react-color'

type Props = {
    color?: string
    label?: string
    onChange?: (value: string) => void
    ref?: RefObject<HTMLInputElement>
}

/*
 * React Color picker
 */
export const ColorPicker = (props: Props) => {
    const [activated, changeActivated] = useState(false)
    const [color, changeColor] = useState(props.color)

    const styleColor: CSSProperties = {
        background: color,
    }

    const onChange = useCallback(
        (value: string) => {
            changeColor(value)
            if (props.onChange) {
                props.onChange(value)
            }
        },
        [props],
    )

    return (
        <div className="color-picker">
            <input type="hidden" value={color} ref={props.ref} />
            <button
                className="color-picker__label"
                onClick={() => changeActivated(!activated)}
            >
                {props.label}
            </button>
            <button
                onClick={() => changeActivated(!activated)}
                className="color-picker__swatch"
                style={styleColor}
            />
            {activated ? (
                <div className="color-picker__popover">
                    <button
                        onClick={() => changeActivated(false)}
                        className="color-picker__cover"
                    />
                    <SwatchesPicker
                        color={color}
                        onChangeComplete={
                            /* istanbul ignore next */ (value) => {
                                changeActivated(false)
                                onChange(value.hex)
                            }
                        }
                    />
                </div>
            ) : null}
        </div>
    )
}
