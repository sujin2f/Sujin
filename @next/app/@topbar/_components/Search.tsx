'use client'
import React, { useState, useRef, type ChangeEvent, type KeyboardEvent, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { KeyCodes } from '@sujin/share/constants/keycode'
/* Assets */
import Magnify from '@app/_lib/images/magnify.svg'

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
                const to = `/archive/search/${keyword}/page/1/`
                router.push(to)
                setKeyword('')
            }
        },
        [keyword, opened, router],
    )
    const handleChangeSearch = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setKeyword(e.target.value)
    }, [])
    const handleKeyDownSearch = useCallback(
        (e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key === KeyCodes.ENTER) {
                handleSubmitSearch()
            }
        },
        [handleSubmitSearch],
    )

    return (
        <section
            className={`${
                opened ? '' : 'w-7'
            } max-md:hidden flex h-7 items-center justify-center bg-primary rounded-full mr-0.5`}
        >
            <input
                className={`${opened ? '' : 'hidden'} text-white font-light text-sm w-40 pl-2 shadow-none outline-none`}
                onChange={handleChangeSearch}
                onKeyDown={handleKeyDownSearch}
                ref={ref}
                type="text"
                value={keyword}
            />

            <button className="flex w-7 h-7 items-center justify-center" onClick={handleSubmitSearch} type="submit">
                <Magnify className="w-4 h-4 fill-white" />
            </button>
        </section>
    )
}
