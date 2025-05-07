'use client'
import type { DetailedHTMLProps, RefObject, SelectHTMLAttributes } from 'react'
/* Components */
import Input from './Input'
/* Utils */
import { joinClassNames } from '../../utils/string'
/* Assets */
import '../../scss/form.scss'

type Options =
    | string[]
    | { [key: string]: string | Record<string, string> | string[] }

type Props<T extends Options> = DetailedHTMLProps<
    SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
> & {
    readonly options: T
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
const Select = <T extends Options>({
    helpText,
    errorMessage,
    ...props
}: Props<T>) => {
    const ariaDescribedby =
        helpText && props.id
            ? `${props.id}-help-text`
            : props['aria-describedby']

    return (
        <Input {...props} helpText={helpText} errorMessage={errorMessage}>
            <select
                aria-describedby={ariaDescribedby}
                className={joinClassNames('form__input', props.className)}
                {...props}
            >
                <Options options={props.options} />
                {/* {Object.entries(options).map(([value, label], index) => {
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
                })} */}
            </select>
        </Input>
    )
}

const Options = ({
    options,
    depth = 0,
}: {
    options: Options
    depth?: number
}) => {
    if (Array.isArray(options)) {
        return (
            <>
                {options.map((option, index) => {
                    return (
                        <option
                            value={option}
                            key={`option-${depth}-${index}-${option}`}
                        >
                            {option}
                        </option>
                    )
                })}
            </>
        )
    }

    return (
        <>
            {Object.entries(options).map(([label, option], index) => (
                <optgroup
                    label={label}
                    key={`optgroup-${depth}-${index}-${label}`}
                >
                    {typeof option === 'string' ? (
                        <option value={option}>{option}</option>
                    ) : (
                        <Options options={option} depth={depth + 1} />
                    )}
                </optgroup>
            ))}
        </>
    )
}

export default Select
