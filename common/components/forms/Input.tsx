'use client'
import {
    type KeyboardEvent,
    type RefObject,
    type PropsWithChildren,
    type InputHTMLAttributes,
    type HTMLInputTypeAttribute,
    useCallback,
    useMemo,
    useRef,
    createElement,
} from 'react'

/* Helpers */
import { filterEmpty } from '../../utils/object'
import { joinClassNames } from '../../utils/string'
/* Assets */
import '../../scss/form.scss'

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
    readonly defaultValue?: string | number
    readonly errorMessage?: string
    readonly helpText?: string
    readonly label?: string
    readonly list?: string
    readonly onEnterKeyDown?: () => void
    readonly type?: HTMLInputTypeAttribute | 'textarea'
    readonly ref?: RefObject<HTMLInputElement | null>
}

export const InputOnly = ({
    errorMessage,
    helpText,
    onEnterKeyDown,
    type,
    value,
    ...props
}: InputProps) => {
    const className = joinClassNames(
        'form__input',
        errorMessage && 'form__input--error',
        helpText && 'form__input--with-help-text',
    )
    const onKeyDown = useCallback(
        (e: KeyboardEvent<HTMLInputElement>) => {
            console.log(1)
            if (e.key === 'Enter' && onEnterKeyDown) {
                onEnterKeyDown()
            }
        },
        [onEnterKeyDown],
    )
    const inputProps = filterEmpty({
        ...props,
        className,
        onKeyDown,
        type,
        value,
        autoComplete: type === 'password' && 'on',
    })
    const Element = createElement(
        type === 'textarea' ? 'textarea' : 'input',
        {
            ...inputProps,
        },
        type === 'textarea' ? value : undefined,
    )

    return Element
}

/**
 * Input component that renders an input field with various styles and behaviors.
 *
 * @param {string} [props.label] - The label for the input field.
 * @param {string} [props.id] - The id of the input field.
 * @param {InputTypes} [props.type] - The type of the input field.
 * @param {string | number} [props.defaultValue] - The default value of the input field.
 * @param {RefObject<HTMLInputElement | null>} [props.ref] - The ref object for the input field.
 * @param {string} [props.helpText] - The help text for the input field.
 * @param {boolean} [props.required] - Whether the input field is required.
 * @param {string} [props.errorMessage] - The error message for the input field.
 * @param {string} [props.list] - The list attribute for the input field.
 * @param {() => void} [props.onEnterKeyDown] - Callback function to handle Enter key down events.
 * @param {ChangeEventHandler<HTMLInputElement>} [props.onChange] - Callback function to handle change events.
 * @param {string | number} [props.value] - The value of the input field.
 * @param {string} [props.placeholder] - The placeholder text for the input field.
 * @param {string} [props.name] - The name of the input field.
 */
export const Input = (props: InputProps) => {
    const refComp = useRef<HTMLInputElement>(null)
    const ref = useMemo(() => props.ref || refComp, [props.ref, refComp])
    const type = useMemo(() => props.type || 'text', [props.type])
    const isCheckbox = type === 'checkbox' || type === 'radio'

    return (
        <>
            {props.label && (
                <LabelComponent {...props} type={type} ref={ref}>
                    {isCheckbox && (
                        <InputContainer {...props} type={type} ref={ref} />
                    )}
                    {props.label}
                </LabelComponent>
            )}

            {(!props.label || !isCheckbox) && (
                <InputContainer {...props} type={type} ref={ref} />
            )}
        </>
    )
}

const LabelComponent = ({
    ref,
    required,
    id,
    children,
}: PropsWithChildren<InputProps>) => {
    return (
        <label
            className={joinClassNames(
                'form__label',
                required && 'form__label--required',
            )}
            htmlFor={id}
            onClick={() => {
                ref?.current?.focus()
            }}
        >
            {children}
        </label>
    )
}

const InputContainer = (props: InputProps) => {
    const ariaDescribedby = props.helpText ? `${props.id}-help-text` : ''
    return (
        <>
            <InputOnly {...props} aria-describedby={ariaDescribedby} />

            {props.errorMessage ? (
                <p className="form__input__error-message">
                    {props.errorMessage}
                </p>
            ) : null}

            {props.helpText ? (
                <p className="form__input__help-text" id={ariaDescribedby}>
                    {props.helpText}
                </p>
            ) : null}
        </>
    )
}

export default Input
