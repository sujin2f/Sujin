'use client'
import type { ReactNode } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
/* Components */
// import { Menu } from '@app/@banner/_components/Menu'
/* T_Types */
import type { T_ImageBlock } from '@sujin/lib/types'

export type BannerProps = {
    readonly icon?: T_ImageBlock
    readonly title?: string | ReactNode
    readonly excerpt?: string | ReactNode
    readonly prefix?: string
    readonly background?: T_ImageBlock
    readonly menu: 'primary' | 'ether' | 'ether-kor' | 'dev-tools' | 'recipe' | 'recipe-user' | 'admin'
    readonly fullHeight?: boolean
}

const Menu = dynamic(() => import('@app/@banner/_components/Menu').then((mod) => ({ default: mod.Menu })), {
    ssr: false,
})

/**
 * Banner component that renders a banner with a title, excerpt, icon, and background image.
 *
 * @param {BannerType} props.banner - The banner data.
 * @param {string} props.menu - The menu name to be used in the banner.
 */
export const Banner = ({ icon, background, prefix, fullHeight, menu, title, excerpt }: BannerProps) => {
    return (
        <>
            <header
                className={`relative w-full bg-gradient-to-b from-gray-900 to-slate-950 min-h-80 ${
                    fullHeight ? 'h-full' : ''
                }`}
                style={{ height: fullHeight ? 'calc(100vh - var(--spacing-header))' : 'auto' }}
            >
                <div className="absolute w-full z-5">
                    <div className="container mx-auto flex justify-end">
                        <Menu position={menu} id="banner" />
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
                    className={`absolute z-1 w-full h-full flex pt-15 items-center ${
                        icon && icon.url ? 'pb-25' : 'pb-15'
                    }`}
                >
                    <div className="container mx-auto">
                        {prefix ? (
                            <span className="w-fit block bg-white text-black pl-1 pr-1 mb-2 mx-auto font-light">
                                {prefix}
                            </span>
                        ) : null}
                        <h2 className="text-white text-center text-5xl">{title}</h2>

                        {excerpt && typeof excerpt === 'string' ? (
                            <p className="bg-white text-black p-1 text-xl w-fit mx-auto mt-5">{excerpt}</p>
                        ) : (
                            excerpt
                        )}
                    </div>
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
