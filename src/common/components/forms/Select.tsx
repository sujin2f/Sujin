import React, { Fragment, ForwardedRef, ChangeEvent, forwardRef } from 'react'
import { generateUUID } from '../../utils/string'

type OptGroup = Record<string, string>

type Props = {
    options: Record<string, string | OptGroup>
    id?: string
    value?: string
    defaultValue?: string
    label?: string
    multiple?: boolean
    autoFocus?: boolean
    disabled?: boolean
    required?: boolean
    helpText?: string
    onChange?: (value: string) => void
}

export const Select = forwardRef(
    (props: Props, ref: ForwardedRef<HTMLSelectElement>): JSX.Element => {
        const {
            label,
            options,
            value,
            defaultValue,
            multiple,
            autoFocus,
            disabled,
            required,
            helpText,
        } = props
        const id = props.id || generateUUID()
        const onChange = (e: ChangeEvent<HTMLSelectElement>) => {
            if (props.onChange) {
                props.onChange(e.target.value)
            }
        }
        const ariaDescribedby = helpText ? `${id}-help-text` : ''
        const labelClassName = `form-label ${
            required ? 'form-label--required' : ''
        }`

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
                    autoFocus={autoFocus}
                    disabled={disabled}
                    required={required}
                    aria-describedby={ariaDescribedby}
                    onChange={onChange}
                >
                    {Object.entries(options).map(
                        ([optionValue, optionText]) => {
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
                                        ([
                                            groupMemberValue,
                                            groupMemberText,
                                        ]) => (
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
                        },
                    )}
                </select>
                {helpText && (
                    <p className="help-text" id={ariaDescribedby}>
                        {helpText}
                    </p>
                )}
            </Fragment>
        )
    },
)
