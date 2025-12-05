'use client'
import { useCallback, type KeyboardEvent } from 'react'
import Input, { type InputProps } from './Input'
import Button from './Button'
import { KeyCodes } from '@sujin/share/constants/keycode'

type Props = InputProps<HTMLInputElement> & {
    button?: string
    readonly onSubmit?: () => void
}

export const InputGroup = ({ onSubmit, button, helpText, errorMessage, ...props }: Props) => {
    const ariaDescribedby = helpText && props.id ? `${props.id}-help-text` : props['aria-describedby']

    const onKeyDown = useCallback(
        (e: KeyboardEvent<HTMLInputElement>) => {
            if (onSubmit && e.key === KeyCodes.ENTER) onSubmit()
        },
        [onSubmit],
    )

    const label = props.label || 'Label'

    return (
        <Input {...props} label={label} helpText={helpText} errorMessage={errorMessage} className="form__input-group">
            <input
                className="form__input"
                aria-describedby={ariaDescribedby}
                onKeyDown={(e) => onKeyDown(e)}
                {...props}
            />
            <Button title={button} onClick={onSubmit} />
        </Input>
    )
}
export default InputGroup
