'use client'
import { useDispatch, useSelector } from 'react-redux'
import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'
/* Utils */
import { useServerAction } from '@app/_lib/hooks/useServerAction'
import { getMenu } from '@app/_lib/graphql/getMenu'
import { setMenu, setMobile } from '@app/_store/slices/menu'
/* T_Types */
import type { RootState } from '@app/_store'

type Props = {
    id: string
    position: string
    showMenu: boolean
}

const TOP_MENU_SCROLLED_POSITION = 80

export function Menu({ id, position, showMenu }: Props) {
    const dispatch = useDispatch()
    // Mobile
    const opened = useSelector((state: RootState) => state.menu.mobile)

    // Scroll
    const [scrolled, setScrolled] = useState('')
    const handleScrolled = useCallback(() => {
        if (window.scrollY > TOP_MENU_SCROLLED_POSITION && !scrolled) {
            setScrolled('scrolled')
            return
        }

        if (window.scrollY <= TOP_MENU_SCROLLED_POSITION && scrolled) {
            setScrolled('')
        }
    }, [scrolled])

    useEffect(() => {
        window.addEventListener('scroll', handleScrolled)
        return () => window.removeEventListener('scroll', handleScrolled)
    }, [handleScrolled])

    // Redux store
    const menus = useSelector((state: RootState) => state.menu.items)
    // const hasStore = useMemo(() => !!(menus[position] && menus[position].length), [menus, position])
    const hasStore = useMemo(() => !!(menus[position] && menus[position].length), [menus, position])
    const [skip, setSkip] = useState(false)

    // Read from GraphQL
    const { data } = useServerAction(async () => await getMenu(position), skip)

    useEffect(() => {
        if (!hasStore && data && data.length) {
            dispatch(setMenu([position, data]))
        }

        setSkip(true)
    }, [data, hasStore, dispatch, position])

    return (
        <nav>
            <ul
                className={`${
                    opened ? 'flex' : 'hidden'
                } absolute w-screen left-0 top-header text-white uppercase h-full flex-col cursor-pointer min-md:flex-row min-md:static min-md:w-auto min-md:flex!`}
                onClick={() => dispatch(setMobile(false))}
            >
                {menus[position] &&
                    menus[position].map((item, index) => (
                        <li key={`menu-item-${id}-${position}-${item.link}`} className="group">
                            <Link
                                style={showMenu ? {} : { marginTop: `${-1 * (50 + index * 40)}px` }}
                                className={`${
                                    scrolled && 'mt-0!'
                                } bg-primary transition-all duration-700 px-4 flex items-center text-white group-hover:bg-primary group-hover:text-white h-auto py-3 max-md:mt-0! min-md:bg-transparent min-md:text-primary min-md:h-full min-md:py-0`}
                                href={item.children!.length ? '#' : item.link}
                                target={item.target}
                            >
                                {item.title}
                            </Link>

                            {item.children && 0 !== item.children.length && (
                                <ul className="group-hover:block min-md:hidden min-md:absolute">
                                    {item.children.map((child) => (
                                        <li key={`menu-item-${id}-${position}-${child.link}`}>
                                            <Link
                                                className="bg-slate-600 transition-colors py-3 px-5 flex items-center hover:bg-slate-800"
                                                href={child.link}
                                                target={child.target}
                                            >
                                                {child.title}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}
            </ul>
        </nav>
    )
}
