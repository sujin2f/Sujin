'use client'
import { useDispatch, useSelector } from 'react-redux'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
/* Utils */
import { useServerAction } from '@app/_hooks/useServerAction'
import { getMenu } from '@app/_lib/graphql/getMenu'
import { setMenu } from '@app/_store/slices/menu'
/* T_Types */
import type { RootState } from '@app/_store'
/* Assets */
import Arrow from '@app/_lib/images/icons/arrow_drop_up.svg'

type Props = {
    key: string
    position: string
}

export function Menu({ key, position }: Props) {
    // Redux store
    const menus = useSelector((state: RootState) => state.menu.items)
    const dispatch = useDispatch()
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
            <ul className="flex text-white uppercase">
                {menus[position] &&
                    menus[position].map((item) => (
                        <li key={`menu-item-${key}-${position}-${item.link}`} className="group">
                            <Link
                                className="bg-transparent border-b-transparent border-b-4 transition-colors py-3 px-5 flex items-center group-hover:bg-primary group-hover:border-b-primary-dark"
                                href={item.children!.length ? '#' : item.link}
                                target={item.target}
                            >
                                {item.title}

                                {item.children && 0 !== item.children.length && (
                                    <Arrow className="rotate-180 w-7 h-7 fill-slate-500 group-hover:rotate-0 group-hover:fill-slate-300" />
                                )}
                            </Link>

                            {item.children && 0 !== item.children.length && (
                                <ul className="absolute hidden group-hover:block">
                                    {item.children.map((child) => (
                                        <li key={`menu-item${key}-${position}-${child.link}`}>
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
//             transform: rotate(180deg);
//             width: 24px;
//             height: 24px;
//             fill: var(--color-slate-500);
