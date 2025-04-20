'use client'
import { useCallback } from 'react'
import { InputProps, Input } from './Input'
import { Button } from './Button'
/* Assets */
import '../../scss/form.scss'

type Props = InputProps<HTMLInputElement> & {
    button?: string
    readonly onSubmit?: () => void
}

export const InputGroup = ({ onSubmit, button, ...props }: Props) => {
    const ariaDescribedby =
        props.helpText && props.id
            ? `${props.id}-help-text`
            : props['aria-describedby']

    const onKeyDown = useCallback(() => {
        if (onSubmit) onSubmit()
    }, [onSubmit])

    const label = props.label || 'Label'

    return (
        <Input {...props} label={label} className="form__input-group">
            <input
                className="form__input"
                aria-describedby={ariaDescribedby}
                onKeyDown={onKeyDown}
            />
            <Button title={button} onClick={onSubmit} />
        </Input>
    )
}
export default InputGroup
