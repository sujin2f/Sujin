import React, { useState, useRef, ChangeEvent, KeyboardEvent } from 'react'

import { useNavigate } from 'react-router-dom'

export const Search = (): JSX.Element => {
    const [opened, setOpened] = useState<boolean>(false)
    const [keyword, setKeyword] = useState<string>('')
    const refTextInput = useRef<HTMLInputElement>(null)
    const navigate = useNavigate()

    const handleSubmitSearch = (
        e?: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ) => {
        if (e) {
            e.preventDefault()
        }

        if (!opened || !keyword) {
            setOpened(true)
            setTimeout(
                () => refTextInput.current && refTextInput.current.focus(),
                300,
            )
            return
        }

        if (keyword) {
            const to = `/search/${keyword}`
            navigate(to)
            setKeyword('')
        }
    }
    const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setKeyword(e.target.value)
    }
    const handleKeyDownSearch = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.keyCode === 13) {
            handleSubmitSearch()
        }
    }

    const wrapperClass = opened ? 'open' : ''
    return (
        <section className={`${wrapperClass} search`}>
            <input
                className="search__input"
                type="text"
                ref={refTextInput}
                value={keyword}
                onChange={handleChangeSearch}
                onKeyDown={handleKeyDownSearch}
            />
            <button
                className="icon magnify search__button"
                onClick={handleSubmitSearch}
                type="submit"
            />
        </section>
    )
}
