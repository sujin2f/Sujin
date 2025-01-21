import React, { Fragment, RefObject, ChangeEvent, useCallback } from 'react'

/* Helpers */
import { joinClassNames } from '../../utils/string'
/* Assets */
import '../../scss/form.scss'

type Props = {
    readonly options: Record<string, string | Record<string, string>>
    readonly id?: string
    readonly value?: string
    readonly defaultValue?: string
    readonly label?: string
    readonly multiple?: boolean
    readonly disabled?: boolean
    readonly required?: boolean
    readonly helpText?: string
    readonly onChange?: (value: string) => void
    readonly ref?: RefObject<HTMLSelectElement>
}

/**
 * Select component that renders a dropdown select field with various styles and behaviors.
 *
 * @param {Record<string, string | Record<string, string>>} props.options - The options for the select field.
 * @param {string} [props.id] - The id of the select field.
 * @param {string} [props.label] - The label for the select field.
 * @param {string} [props.value] - The value of the select field.
 * @param {string} [props.defaultValue] - The default value of the select field.
 * @param {boolean} [props.multiple] - Whether the select field allows multiple selections.
 * @param {boolean} [props.disabled] - Whether the select field is disabled.
 * @param {boolean} [props.required] - Whether the select field is required.
 * @param {string} [props.helpText] - The help text for the select field.
 * @param {(value: string) => void} [props.onChange] - Callback function to handle change events.
 * @param {RefObject<HTMLSelectElement>} [props.ref] - The ref object for the select field.
 */
export const Select = ({
    id,
    label,
    options,
    value,
    defaultValue,
    multiple,
    disabled,
    required,
    helpText,
    ref,
    onChange: propsOnChange,
}: Props) => {
    const ariaDescribedby = helpText ? `${id}-help-text` : ''

    const onChange = useCallback(
        (e: ChangeEvent<HTMLSelectElement>) => {
            if (propsOnChange) {
                propsOnChange(e.target.value)
            }
        },
        [propsOnChange],
    )

    return (
        <Fragment>
            {label && (
                <label
                    htmlFor={id}
                    className={joinClassNames(
                        'form__label',
                        required && 'form__label--required',
                    )}
                >
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
