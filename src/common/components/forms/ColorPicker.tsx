import React, {
    CSSProperties,
    useState,
    forwardRef,
    ForwardedRef,
    useCallback,
} from 'react'
import { SwatchesPicker } from 'react-color'

type Props = {
    color?: string
    label?: string
    onChange?: (value: string) => void
}

/*
 * React Color picker
 */
export const ColorPicker = forwardRef(
    (props: Props, ref: ForwardedRef<HTMLInputElement>): JSX.Element => {
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
                <input type="hidden" value={color} ref={ref} />
                <div
                    className="color-picker__label"
                    onClick={() => changeActivated(!activated)}
                >
                    {props.label}
                </div>
                <div
                    onClick={() => changeActivated(!activated)}
                    className="color-picker__swatch"
                    style={styleColor}
                />
                {activated ? (
                    <div className="color-picker__popover">
                        <div
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
    },
)
