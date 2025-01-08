import React, {
    ChangeEventHandler,
    Fragment,
    KeyboardEvent,
    RefObject,
    useCallback,
    useMemo,
    useRef,
    createElement,
} from 'react'
import { filterEmpty } from '@common/utils/object'
import { generateUUID } from '@common/utils/string'
import { className as getClassName } from '@common/utils/string'

import '@common/scss/form.scss'

type Props = {
    readonly label?: string
    readonly id?: string
    readonly type?:
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
    readonly defaultValue?: string | number
    readonly reference?: RefObject<HTMLInputElement>
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

export function Input(props: Props) {
    const {
        label,
        defaultValue,
        reference: refProp,
        helpText,
        required,
        errorMessage,
        list,
        value,
        onEnterKeyDown,
        onChange,
        placeholder,
        name,
    } = props

    const refComp = useRef<HTMLInputElement>(null)
    const ref = useMemo(() => refProp || refComp, [refProp, refComp])
    const id = useMemo(() => props.id || generateUUID(), [props.id])
    const type = useMemo(() => props.type || 'text', [props.type])
    const ariaDescribedby = useMemo(
        () => (helpText ? `${id}-help-text` : ''),
        [helpText, id],
    )
    const labelClassNames = useMemo(
        () => getClassName('form__label', required && 'form__label--required'),
        [required],
    )
    const className = useMemo(
        () =>
            getClassName(
                'form__input',
                errorMessage && 'form__input--error',
                helpText && 'form__input--with-help-text',
            ),
        [errorMessage, helpText],
    )
    const inputProps = useMemo(
        () =>
            filterEmpty({
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
            }),
        [
            id,
            type,
            defaultValue,
            ref,
            ariaDescribedby,
            required,
            className,
            list,
            value,
            placeholder,
            name,
        ],
    )

    const onKeyDown = useCallback(
        (e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter' && onEnterKeyDown) {
                onEnterKeyDown()
            }
        },
        [onEnterKeyDown],
    )

    const dom = useMemo(
        () => (type === 'textarea' ? 'textarea' : 'input'),
        [type],
    )

    const Element = useMemo(
        () =>
            createElement(
                dom,
                {
                    ...inputProps,
                    onKeyDown,
                    onChange,
                },
                type === 'textarea' ? value : undefined,
            ),
        [dom, inputProps, onKeyDown, onChange, type, value],
    )

    const inputComponent = (
        <Fragment>
            {Element}

            {errorMessage ? (
                <p className="form__input__error-message">{errorMessage}</p>
            ) : null}

            {helpText ? (
                <p className="form__input__help-text" id={ariaDescribedby}>
                    {helpText}
                </p>
            ) : null}
        </Fragment>
    )
    const labelComponent = (
        <Fragment>
            {label ? (
                <label
                    className={labelClassNames}
                    htmlFor={id}
                    onClick={() => {
                        ref.current?.focus()
                    }}
                >
                    {(type === 'checkbox' || type === 'radio') &&
                        inputComponent}

                    {label}
                </label>
            ) : null}
        </Fragment>
    )

    return (
        <Fragment>
            {labelComponent}

            {type !== 'checkbox' && type !== 'radio' && inputComponent}
        </Fragment>
    )
}
