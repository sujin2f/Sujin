import React, { useState, useRef, ChangeEvent, KeyboardEvent } from 'react'
import { useHistory } from 'react-router-dom'

export const Search = (): JSX.Element => {
    const [opened, setOpened] = useState<boolean>(false)
    const [keyword, setKeyword] = useState<string>('')
    const refTextInput = useRef<HTMLInputElement>(null)
    const history = useHistory()

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
            history.push(to)
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
        <section id="search-container" className={wrapperClass}>
            <input
                type="text"
                ref={refTextInput}
                value={keyword}
                onChange={handleChangeSearch}
                onKeyDown={handleKeyDownSearch}
            />
            <button
                id="search-button"
                className="icon magnify"
                onClick={handleSubmitSearch}
                type="submit"
            />
        </section>
    )
}
