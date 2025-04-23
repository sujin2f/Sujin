'use client'
import type { DetailedHTMLProps, RefObject, SelectHTMLAttributes } from 'react'

/* Helpers */
import { joinClassNames } from '../../utils/string'
/* Assets */
import '../../scss/form.scss'
import Input from './Input'

type Props = DetailedHTMLProps<
    SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
> & {
    readonly options: Record<string, string | Record<string, string>> | string[]
    readonly errorMessage?: string
    readonly helpText?: string
    readonly label?: string
    readonly ref?: RefObject<HTMLSelectElement | null>
}

/**
 * Select component that renders a dropdown select field with various styles and behaviors.
 *
 * @param {Record<string, string | Record<string, string>>} props.options - The options for the select field.
 * @param {string} [props.errorMessage] - The error message for the input field.
 * @param {string} [props.helpText] - The help text for the select field.
 * @param {string} [props.label] - The label for the input field.
 * @param {RefObject<HTMLSelectElement>} [props.ref] - The ref object for the select field.
 */
const Select = ({
    options: optionsProp,
    helpText,
    errorMessage,
    ...props
}: Props) => {
    const ariaDescribedby =
        helpText && props.id
            ? `${props.id}-help-text`
            : props['aria-describedby']

    let options: Record<string, string | Record<string, string>> = {}
    if (Array.isArray(optionsProp)) {
        optionsProp.forEach((option) => {
            options[option] = option
        })
    } else {
        options = optionsProp
    }

    return (
        <Input {...props} helpText={helpText} errorMessage={errorMessage}>
            <select
                aria-describedby={ariaDescribedby}
                className={joinClassNames('form__input', props.className)}
                {...props}
            >
                {Object.entries(options).map(([value, label], index) => {
                    if (typeof label === 'string') {
                        return (
                            <option
                                value={value}
                                key={`option-${index}-${value}`}
                            >
                                {label}
                            </option>
                        )
                    }

                    return (
                        <optgroup
                            label={value}
                            key={`optgroup-${index}-${value}`}
                        >
                            {Object.entries(label).map(([gValue, gLabel]) => (
                                <option
                                    value={gValue}
                                    key={`option-${index}-${value}-${gValue}`}
                                >
                                    {gLabel}
                                </option>
                            ))}
                        </optgroup>
                    )
                })}
            </select>
        </Input>
    )
}

export default Select
