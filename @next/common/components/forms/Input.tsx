'use client'
import {
    type KeyboardEvent,
    type RefObject,
    type InputHTMLAttributes,
    type HTMLInputTypeAttribute,
    type DetailedHTMLProps,
    type PropsWithChildren,
    useCallback,
    createElement,
} from 'react'

/* Helpers */
import { filterEmpty } from '@sujin/share/utils/object'
import { joinClassNames } from '@sujin/share/utils/string'
/* Assets */
import '@commonscss/form.scss'

export type InputProps<T extends HTMLElement> = PropsWithChildren<
    DetailedHTMLProps<InputHTMLAttributes<T>, T>
> & {
    readonly errorMessage?: string
    readonly helpText?: string
    readonly label?: string
    readonly onEnterKeyDown?: () => void
    readonly type?: HTMLInputTypeAttribute | 'textarea'
    readonly ref?: RefObject<T | null>
    readonly rows?: number
}

/**
 * Input component that renders an input field with various styles and behaviors.
 *
 * @param {string} [props.label] - The label for the input field.
 * @param {HTMLInputTypeAttribute | 'textarea'} [props.type] - The type of the input field.
 * @param {string} [props.helpText] - The help text for the input field.
 * @param {string} [props.errorMessage] - The error message for the input field.
 * @param {() => void} [props.onEnterKeyDown] - Callback function to handle Enter key down events.
 */
const Input = <T extends HTMLElement>({
    errorMessage,
    className,
    helpText,
    onEnterKeyDown,
    label,
    rows,
    children,
    ...props
}: InputProps<T>) => {
    const type = props.type || 'text'
    const isCheckbox = type === 'checkbox' || type === 'radio'
    const ariaDescribedby =
        helpText && props.id
            ? `${props.id}-help-text`
            : props['aria-describedby']

    const onKeyDown = useCallback(
        (e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter' && onEnterKeyDown) {
                onEnterKeyDown()
            }
        },
        [onEnterKeyDown],
    )
    const inputProps = filterEmpty({
        onKeyDown,
        type,
        'aria-describedby': ariaDescribedby,
        className: 'form__input',
        autoComplete: type === 'password' && 'on',
    })
    if (type === 'textarea' && rows) {
        inputProps.rows = rows
    }
    const Element =
        children ||
        createElement(
            type === 'textarea' ? 'textarea' : 'input',
            {
                ...inputProps,
                ...props,
            },
            type === 'textarea' ? props.value : undefined,
        )

    return (
        <div
            className={joinClassNames(
                'form__input__container',
                errorMessage && 'form__input--error',
                className,
            )}
        >
            {label ? (
                <label htmlFor={props.id}>
                    {isCheckbox && Element}
                    <span
                        className={joinClassNames(
                            'form__label',
                            props.required && 'form__label--required',
                        )}
                    >
                        {label}
                    </span>
                    {!isCheckbox && Element}
                </label>
            ) : (
                Element
            )}

            {errorMessage ? (
                <p className="form__input__error-message">{errorMessage}</p>
            ) : null}

            {helpText ? (
                <p className="form__input__help-text" id={ariaDescribedby}>
                    {helpText}
                </p>
            ) : null}
        </div>
    )
}
export default Input
