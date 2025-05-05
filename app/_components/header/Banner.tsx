'use client'
import type { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
/* Components */
import Row from '@common/components/layout/Row'
import Column from '@common/components/layout/Column'
import Menu from '@common/components/layout/Menu'
import NextImage from '@common/components/containers/NextImage'
import { MENU_NAMES } from '@app/_lib/types'
/* CONSTANTS */
import { MENUS, METADATA } from '@app/_lib/constants'
/* Utils */
import { entries } from '@common/utils/object'
import { joinClassNames } from '@common/utils/string'
/* T_Types */
import { IMAGE_SIZE_BACKGROUND, T_ImageBlock } from '@app/_lib/types'
import type { ImageMap } from '@common/components/containers/Picture'
/* Assets */
import '@app/_components/header/Banner.scss'

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
    const menu = MENUS[props.menu || MENU_NAMES.MAIN]
    const path = usePathname()

    const title = path && METADATA[path] ? METADATA[path].title : props.title
    const excerpt =
        props.excerpt ||
        (path && METADATA[path] ? METADATA[path].description : null)

    const styleBg = backgroundColor
        ? {
              backgroundColor,
          }
        : {}

    return (
        <>
            <section
                className={joinClassNames(style?.banner, 'banner')}
                style={styleBg}
            >
                <div className="show-for-large menu__container--banner">
                    <Row>
                        <Column small={12}>
                            <Menu items={menu} />
                        </Column>
                    </Row>
                </div>

                <div
                    className={joinClassNames(
                        style?.banner__overlay,
                        'banner__overlay',
                    )}
                ></div>

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

    const bannerMediaQueries: Record<IMAGE_SIZE_BACKGROUND, string> = {
        [IMAGE_SIZE_BACKGROUND.MEDIUM]: '(max-width: 300px)',
        [IMAGE_SIZE_BACKGROUND.MEDIUM_LARGE]: '(max-width: 768px)',
        [IMAGE_SIZE_BACKGROUND.LARGE]: '(max-width: 1024px)',
    }

    return entries(image.sizes)
        .filter(([size]) => Object.keys(bannerMediaQueries).includes(size))
        .map(([size, value]) => {
            const key = size as IMAGE_SIZE_BACKGROUND
            return {
                src: value.url,
                media: bannerMediaQueries[key] || '',
                mimeType: value.mimeType,
                width: value.width,
                height: value.height,
            } satisfies ImageMap
        })
}
