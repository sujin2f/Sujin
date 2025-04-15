'use client'
import React, {
    ChangeEventHandler,
    Fragment,
    KeyboardEvent,
    RefObject,
    useCallback,
    useMemo,
    useRef,
    createElement,
    PropsWithChildren,
} from 'react'

/* Helpers */
import { filterEmpty } from '../../utils/object'
import { joinClassNames } from '../../utils/string'
/* Assets */
import '../../scss/form.scss'

type InputTypes =
    | 'text'
    | 'number'
    | 'checkbox'
    | 'color'
    | 'date'
    | 'email'
    | 'file'
    | 'password'
    | 'radio'
    | 'range'
    | 'tel'
    | 'time'
    | 'url'
    | 'search'
    | 'textarea'

export type InputProps = {
    readonly defaultValue?: string | number
    readonly errorMessage?: string
    readonly helpText?: string
    readonly id?: string
    readonly label?: string
    readonly list?: string
    readonly name?: string
    readonly onChange?: ChangeEventHandler<HTMLInputElement>
    readonly onEnterKeyDown?: () => void
    readonly placeholder?: string
    readonly ref?: RefObject<HTMLInputElement | null>
    readonly required?: boolean
    readonly type?: InputTypes
    readonly value?: string | number
}

export const InputOnly = ({
    ariaDescribedby,
    defaultValue,
    errorMessage,
    helpText,
    id,
    list,
    name,
    onChange,
    onEnterKeyDown,
    placeholder,
    ref,
    required,
    type,
    value,
}: InputProps & { ariaDescribedby?: string }) => {
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
        id,
        type,
        defaultValue,
        ref,
        'aria-describedby': ariaDescribedby,
        required,
        className,
        list,
        value,
        placeholder,
        name,
        autoComplete: type === 'password' && 'on',
    })
    const Element = createElement(
        type === 'textarea' ? 'textarea' : 'input',
        {
            ...inputProps,
            onKeyDown,
            onChange,
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
        <Fragment>
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
        </Fragment>
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
            <InputOnly {...props} ariaDescribedby={ariaDescribedby} />

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
