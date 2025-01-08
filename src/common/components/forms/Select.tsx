import React, { Fragment, RefObject, ChangeEvent, useCallback } from 'react'
import { className, generateUUID } from '../../utils/string'

import '@src/common/scss/form.scss'

type OptGroup = Record<string, string>

type Props = {
    options: Record<string, string | OptGroup>
    id?: string
    value?: string
    defaultValue?: string
    label?: string
    multiple?: boolean
    disabled?: boolean
    required?: boolean
    helpText?: string
    onChange?: (value: string) => void
    ref?: RefObject<HTMLSelectElement>
}

/*
 * HTML Select
 */
export const Select = (props: Props) => {
    const {
        label,
        options,
        value,
        defaultValue,
        multiple,
        disabled,
        required,
        helpText,
        ref,
    } = props
    const id = props.id || generateUUID()
    const ariaDescribedby = helpText ? `${id}-help-text` : ''
    const labelClassName = className(
        'form__label',
        required && 'form__label--required',
    )

    const onChange = useCallback(
        (e: ChangeEvent<HTMLSelectElement>) => {
            if (props.onChange) {
                props.onChange(e.target.value)
            }
        },
        [props],
    )

    return (
        <Fragment>
            {label && (
                <label htmlFor={id} className={labelClassName}>
                    {label}
                </label>
            )}

            <select
                ref={ref}
                id={id}
                value={value}
                defaultValue={defaultValue}
                multiple={multiple}
                disabled={disabled}
                required={required}
                aria-describedby={ariaDescribedby}
                onChange={onChange}
                className="form__input"
            >
                {Object.entries(options).map(([optionValue, optionText]) => {
                    if (typeof optionText === 'string') {
                        return (
                            <option
                                value={optionValue}
                                key={`option-${id}-${optionValue}`}
                            >
                                {optionText}
                            </option>
                        )
                    }

                    const groupLabel = optionValue
                    const groupOption = optionText
                    return (
                        <optgroup
                            label={groupLabel}
                            key={`optgroup-${id}-${optionValue}`}
                        >
                            {Object.entries(groupOption).map(
                                ([groupMemberValue, groupMemberText]) => (
                                    <option
                                        value={groupMemberValue}
                                        key={`option-${id}-${groupLabel}-${groupMemberValue}`}
                                    >
                                        {groupMemberText as string}
                                    </option>
                                ),
                            )}
                        </optgroup>
                    )
                })}
            </select>
            {helpText && (
                <p className="help-text" id={ariaDescribedby}>
                    {helpText}
                </p>
            )}
        </Fragment>
    )
}
