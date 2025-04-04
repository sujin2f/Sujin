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

type Props = {
    readonly label?: string
    readonly id?: string
    readonly type?: InputTypes
    readonly defaultValue?: string | number
    readonly ref?: RefObject<HTMLInputElement | null>
    readonly helpText?: string
    readonly required?: boolean
    readonly errorMessage?: string
    readonly list?: string
    readonly onEnterKeyDown?: () => void
    readonly onChange?: ChangeEventHandler<HTMLInputElement>
    readonly value?: string | number
    readonly placeholder?: string
    readonly name?: string
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
export const Input = (props: Props) => {
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
}: PropsWithChildren<Props>) => {
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

const InputContainer = (props: Props) => {
    const ariaDescribedby = props.helpText ? `${props.id}-help-text` : ''
    return (
        <>
            <InputComponent {...props} ariaDescribedby={ariaDescribedby} />

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

const InputComponent = ({
    defaultValue,
    ref,
    helpText,
    required,
    errorMessage,
    list,
    value,
    onEnterKeyDown,
    onChange,
    placeholder,
    name,
    id,
    type,
    ariaDescribedby,
}: Props & { ariaDescribedby: string }) => {
    const className = joinClassNames(
        'form__input',
        errorMessage && 'form__input--error',
        helpText && 'form__input--with-help-text',
    )
    const onKeyDown = useCallback(
        (e: KeyboardEvent<HTMLInputElement>) => {
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
