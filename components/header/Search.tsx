'use client'
import React, {
    useState,
    useRef,
    type ChangeEvent,
    type KeyboardEvent,
    useCallback,
} from 'react'
import { useRouter } from 'next/navigation'
import { KeyCodes } from '@common/constants/keycode'
/* Assets */
import Magnify from '@src/images/magnify.svg'

export default function Search() {
    const [opened, setOpened] = useState<boolean>(false)
    const [keyword, setKeyword] = useState<string>('')
    const ref = useRef<HTMLInputElement>(null)
    const router = useRouter()

    const handleSubmitSearch = useCallback(
        (e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            if (e) {
                e.preventDefault()
            }

            if (!opened || !keyword) {
                setOpened(true)
                setTimeout(() => ref.current && ref.current.focus(), 300)
                return
            }

            if (keyword) {
                const to = `/search/${keyword}`
                router.push(to)
                setKeyword('')
            }
        },
        [keyword, opened, router],
    )
    const handleChangeSearch = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            setKeyword(e.target.value)
        },
        [],
    )
    const handleKeyDownSearch = useCallback(
        (e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key === KeyCodes.ENTER) {
                handleSubmitSearch()
            }
        },
        [handleSubmitSearch],
    )

    const wrapperClass = opened ? 'open' : ''

    return (
        <section className={`${wrapperClass} search`}>
            <input
                className="search__input"
                onChange={handleChangeSearch}
                onKeyDown={handleKeyDownSearch}
                ref={ref}
                type="text"
                value={keyword}
            />

            <button
                className="search__button"
                onClick={handleSubmitSearch}
                type="submit"
            >
                <Magnify />
            </button>
        </section>
    )
}
