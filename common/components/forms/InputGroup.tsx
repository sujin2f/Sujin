'use client'
import { InputProps, InputOnly } from './Input'
import { Button } from './Button'
/* Assets */
import '../../scss/form.scss'

export const InputGroup = (props: InputProps) => {
    return (
        <label className="input-group">
            <span className="input-group__label">Label</span>
            <InputOnly {...props} />
            <Button />
        </label>
    )
}
export default InputGroup
