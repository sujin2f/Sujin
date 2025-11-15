'use client'
import { useEffect, useState, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
/* Components */
import Row from '@common/components/layout/Row'
import Column from '@common/components/layout/Column'
import Menu from '@common/components/layout/Menu'
import NextImage from '@common/components/containers/NextImage'
/* CONSTANTS */
import { MENUS, METADATA } from '@lib/constants'
import { IMAGE_SIZE_BACKGROUND } from '@sujin/lib/constants'
/* Utils */
import { entries } from '@sujin/share/utils/object'
import { joinClassNames } from '@sujin/share/utils/string'
import { debounce } from '@sujin/share/utils/dom'
/* T_Types */
import { MENU_NAMES, T_ImageBlock } from '@sujin/lib/types'
import type { ImageMap } from '@common/components/containers/Picture'
/* Assets */
import './Banner.scss'

export type BannerProps = {
    readonly title?: string | ReactNode
    readonly excerpt?: string | ReactNode
    readonly icon?: T_ImageBlock
    readonly prefix?: string
    readonly background?: T_ImageBlock
    readonly backgroundColor?: string
    readonly menu?: MENU_NAMES
    readonly style?: Record<string, string>
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
    backgroundColor,
    prefix,
    style,
    ...props
}: BannerProps) {
    const menu = MENUS[props.menu!]
    const path = usePathname()
    const [isBackground, setIsBackground] = useState(false)

    const title = path && METADATA[path] ? METADATA[path].title : props.title
    const excerpt =
        props.excerpt ||
        (path && METADATA[path] ? METADATA[path].description : null)

    const styleBg = backgroundColor
        ? {
              backgroundColor,
          }
        : {}

    useEffect(() => {
        if (background) {
            debounce(() => {
                setIsBackground(true)
            }, 0.05)
        }
    }, [background])

    return (
        <>
            <section
                className={joinClassNames(
                    style?.banner,
                    'banner',
                    isBackground && 'banner--show',
                )}
                style={styleBg}
            >
                <div className="show-for-large menu__container--banner">
                    <Row>
                        <Column small={12}>
                            <Menu items={menu} />
                        </Column>
                    </Row>
                </div>

                {background && background.url && (
                    <div
                        className={joinClassNames(
                            style?.banner__overlay,
                            'banner__overlay',
                        )}
                    />
                )}
                {background && background.url ? (
                    <NextImage
                        sources={getBannerImageMap(background)}
                        src={background.url}
                        alt=""
                        width={background.width || 1000}
                        height={background.height || 700}
                        className={joinClassNames(
                            style?.banner__background,
                            'banner__background',
                        )}
                    />
                ) : null}

                <div
                    className={joinClassNames(
                        'banner__header',
                        'loader--banner',
                        icon && 'banner__header--with-icon',
                        style?.banner__header,
                    )}
                >
                    <Row>
                        <Column small={12} className="column--banner__title">
                            <h1
                                className={joinClassNames(
                                    'banner__title',
                                    style?.banner__title,
                                )}
                            >
                                {prefix ? (
                                    <span className="banner__title__tag">
                                        {prefix}
                                    </span>
                                ) : null}

                                {title}
                            </h1>

                            {excerpt && typeof excerpt === 'string' ? (
                                <p
                                    className={joinClassNames(
                                        'banner__excerpt',
                                        style?.banner__excerpt,
                                    )}
                                >
                                    {excerpt}
                                </p>
                            ) : (
                                excerpt
                            )}
                        </Column>
                    </Row>
                </div>
            </section>

            {icon && icon.url ? (
                <picture className="banner__icon__container">
                    <Image
                        src={icon.url}
                        alt=""
                        width={300}
                        height={300}
                        className="banner__icon"
                    />
                </picture>
            ) : (
                <></>
            )}
        </>
    )
}

const getBannerImageMap = (image: T_ImageBlock): ImageMap[] => {
    if (!image.sizes) {
        return []
    }

    const bannerMediaQueries: Record<string, string> = {
        [IMAGE_SIZE_BACKGROUND.MEDIUM]: '(max-width: 300px)',
        [IMAGE_SIZE_BACKGROUND.MEDIUM_LARGE]: '(max-width: 768px)',
        [IMAGE_SIZE_BACKGROUND.LARGE]: '(max-width: 1024px)',
    }

    return entries(image.sizes)
        .filter(
            ([size, value]) =>
                Object.keys(bannerMediaQueries).includes(size) && value,
        )
        .map(([size, value]) => {
            const key = size
            return {
                src: value.url,
                media: bannerMediaQueries[key] || '',
                mimeType: value.mimeType,
                width: value.width,
                height: value.height,
            } satisfies ImageMap
        })
}
