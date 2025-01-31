'use client'

import React, { Fragment, ReactNode } from 'react'
import { usePathname } from 'next/navigation'

/* Components */
import { Row } from '@common/components/layout/Row'
import { Column } from '@common/components/layout/Column'
import { Menu } from '@common/components/layout/Menu'
/* Helpers */
import { joinClassNames, removeURLProtocol } from '@common/utils/string'
import { ImageType } from '@src/constants/wp'
import { getImageMap } from '@src/utils/common'
import { getMenu } from '@src/utils/menu'
import type { Image } from '@src/types/wordpress'
import { metadata } from '@src/constants/metadata'
/* Assets */
import '@src/scss/banner.scss'

export type BannerType = {
    title?: string | ReactNode
    excerpt?: string
    icon?: Image
    prefix?: string
    background?: Image
    backgroundColor?: string
}

type Props = {
    banner?: BannerType
    menu: string
}

/**
 * Banner component that renders a banner with a title, excerpt, icon, and background image.
 *
 * @param {BannerType} props.banner - The banner data.
 * @param {string} props.menu - The menu name to be used in the banner.
 */
export function Banner({ menu: menuName, banner }: Props) {
    const menu = getMenu(menuName)
    const path = usePathname()

    const title =
        path && metadata[path]
            ? metadata[path].title?.toString()
            : banner?.title
    const excerpt =
        path && metadata[path] ? metadata[path].description : banner?.excerpt

    const style =
        banner && banner.backgroundColor
            ? {
                  backgroundColor: banner.backgroundColor,
              }
            : {}

    const imageMapBackground =
        banner && banner.background
            ? getImageMap(ImageType.HEADER, banner.background.sizes)
            : []

    const imageMapIcon =
        banner && banner.icon
            ? getImageMap(ImageType.ICON, banner.icon.sizes)
            : []

    return (
        <Fragment>
            <section className="banner" style={style}>
                <div className="show-for-large menu__container--banner">
                    <Row>
                        <Column small={12}>
                            <Menu items={menu} />
                        </Column>
                    </Row>
                </div>

                <div className="banner__overlay"></div>

                {banner && banner.background && (
                    <picture className="banner__background">
                        {imageMapBackground.map((map) => (
                            <source
                                key={`header-${map.file}`}
                                media={map.key}
                                srcSet={map.file}
                                type={banner.background?.mimeType}
                            />
                        ))}

                        <img
                            alt=""
                            role="presentation"
                            src={removeURLProtocol(banner.background.url)}
                        />
                    </picture>
                )}

                <div
                    className={joinClassNames(
                        'banner__header',
                        banner && banner.icon && 'banner__header--with-icon',
                    )}
                >
                    <Row>
                        <Column small={12} className="column--banner__title">
                            <h1 className="banner__title">
                                {banner && banner.prefix ? (
                                    <span className="banner__title__tag">
                                        {banner.prefix}
                                    </span>
                                ) : null}

                                {title}
                            </h1>

                            {excerpt && (
                                <p className="banner__excerpt">{excerpt}</p>
                            )}
                        </Column>
                    </Row>
                </div>
            </section>

            {banner && banner.icon && (
                <picture className="banner__icon__container">
                    {imageMapIcon.map((map) => (
                        <source
                            key={`icon-${map.file}`}
                            media={map.key}
                            srcSet={map.file}
                            type={banner.icon?.mimeType}
                        />
                    ))}

                    <img
                        alt=""
                        className="banner__icon"
                        role="presentation"
                        src={removeURLProtocol(banner.icon.url)}
                    />
                </picture>
            )}
        </Fragment>
    )
}
