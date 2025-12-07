'use client'
import { type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
/* Components */
import Menu from '@common/components/layout/Menu'
/* CONSTANTS */
import { MENUS, METADATA } from '@lib/constants'
import { MENU_NAMES } from '@sujin/lib/constants'
/* T_Types */
import type { T_ImageBlock } from '@sujin/lib/types'

export type BannerProps = {
    readonly icon?: T_ImageBlock
    readonly title?: string | ReactNode
    readonly excerpt?: string | ReactNode
    readonly prefix?: string
    readonly background?: T_ImageBlock
    readonly menu?: MENU_NAMES
    readonly fullHeight?: boolean
}

/**
 * Banner component that renders a banner with a title, excerpt, icon, and background image.
 *
 * @param {BannerType} props.banner - The banner data.
 * @param {string} props.menu - The menu name to be used in the banner.
 */
export function Banner({
    icon,
    background,
    prefix,
    fullHeight,
    menu: _menu,
    title: _title,
    excerpt: _excerpt,
}: BannerProps) {
    const menu = MENUS[_menu || MENU_NAMES.MAIN]
    const path = usePathname()

    const title = path && METADATA[path] ? METADATA[path].title : _title
    const excerpt = _excerpt || (path && METADATA[path] ? METADATA[path].description : null)

    return (
        <>
            <header
                className={`relative w-full bg-gradient-to-b from-gray-900 to-slate-950 ${fullHeight ? 'h-full' : ''}`}
                style={{ height: fullHeight ? 'calc(100vh - var(--spacing-header))' : 'auto' }}
            >
                <div className="absolute w-full z-5">
                    <div className="container mx-auto flex justify-end">
                        <Menu items={menu} className="menu--banner" />
                    </div>
                </div>

                {background && background.url ? (
                    <picture className="absolute overflow-hidden w-full h-full z-0 opacity-40 align-middle">
                        <Image
                            src={background.url}
                            alt="background image"
                            width={background.width || 1000}
                            height={background.height || 700}
                            className="w-full object-cover object-center h-full"
                        />
                    </picture>
                ) : null}

                <div
                    className={`relative z-1 container mx-auto pt-20 flex flex-col h-full justify-center ${
                        icon && icon.url ? 'pb-25' : 'pb-15'
                    }`}
                >
                    {prefix ? (
                        <span className="block bg-white text-black pl-1 pr-1 mb-2 mx-auto font-light">{prefix}</span>
                    ) : null}
                    <h2 className="text-white text-center text-5xl">{title}</h2>

                    {excerpt && typeof excerpt === 'string' ? (
                        <p className="bg-white text-black p-1 text-xl w-fit mx-auto mt-5">{excerpt}</p>
                    ) : (
                        excerpt
                    )}
                </div>
            </header>
            {icon && icon.url && (
                <Image
                    src={icon.url}
                    alt=""
                    width={144}
                    height={144}
                    className="relative z-1 rounded-full mx-auto -mt-18"
                />
            )}
        </>
    )
}
