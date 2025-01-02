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
import { filterEmpty } from 'src/common/utils/object'
import { generateUUID } from 'src/common/utils/string'
import { className as getClassName } from 'src/common/utils/string'

require('src/common/scss/form.scss')

type Props = {
    label?: string
    id?: string
    type?:
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
    defaultValue?: string | number
    reference?: RefObject<HTMLInputElement>
    helpText?: string
    required?: boolean
    errorMessage?: string
    list?: string
    onEnterKeyDown?: () => void
    onChange?: ChangeEventHandler<HTMLInputElement>
    autoFocus?: boolean
    value?: string | number
    placeholder?: string
    name?: string
}

export const Input = (props: Props): JSX.Element => {
    const {
        label,
        defaultValue,
        reference: refProp,
        helpText,
        required,
        errorMessage,
        list,
        autoFocus,
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
                autoFocus,
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
            autoFocus,
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
            {errorMessage && (
                <p className="form__input__error-message">{errorMessage}</p>
            )}
            {helpText && (
                <p className="form__input__help-text" id={ariaDescribedby}>
                    {helpText}
                </p>
            )}
        </Fragment>
    )
    const labelComponent = (
        <Fragment>
            {label && (
                <Fragment>
                    <label
                        htmlFor={id}
                        className={labelClassNames}
                        onClick={() => {
                            ref.current?.focus()
                        }}
                    >
                        {(type === 'checkbox' || type === 'radio') &&
                            inputComponent}
                        {label}
                    </label>
                </Fragment>
            )}
        </Fragment>
    )

    return (
        <Fragment>
            {labelComponent}
            {type !== 'checkbox' && type !== 'radio' && inputComponent}
        </Fragment>
    )
}
