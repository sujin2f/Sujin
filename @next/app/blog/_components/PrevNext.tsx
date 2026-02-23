'use client'
import Link from 'next/link'
/* T_Types */
import type { T_PrevNext } from '@sujin/lib/types'
/* Assets */
import Icon from '@app/_lib/images/prev.svg'

type Props = {
    readonly prev?: T_PrevNext | false
    readonly next?: T_PrevNext | false
}

export const PrevNext = ({ prev, next }: Props) => {
    return (
        <nav className="grid grid-cols-2 mt-5">
            <div>
                {prev && (
                    <Link
                        href={prev.link}
                        className="group grid grid-cols-[fit-content(20px)_1fr] text-primary justify-center gap-2"
                    >
                        <Icon className="w-4 group-hover:fill-primary" />
                        <div>{prev.title}</div>
                    </Link>
                )}
            </div>
            {next && (
                <Link
                    href={next.link}
                    className="group grid grid-cols-[1fr_fit-content(20px)] text-primary justify-center gap-2"
                >
                    <div className="text-right">{next.title}</div>
                    <Icon className="w-4 rotate-180 group-hover::fill-primary" />
                </Link>
            )}
        </nav>
    )
}
