'use client'
import { InputProps, InputOnly } from './Input'
import { Button } from './Button'
/* Assets */
import '../../scss/form.scss'
import { useCallback } from 'react'

export const InputGroup = (
    props: InputProps & { button?: string; readonly onSubmit?: () => void },
) => {
    const onEnterKeyDown = useCallback(() => {
        if (props.onSubmit) props.onSubmit()
    }, [props])
    return (
        <label className="input-group">
            <span className="input-group__label">{props.label || 'Label'}</span>
            <InputOnly {...props} onEnterKeyDown={onEnterKeyDown} />
            <Button title={props.button} onClick={props.onSubmit} />
        </label>
    )
}
export default InputGroup
