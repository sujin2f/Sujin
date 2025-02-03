'use client'
import React, { Fragment, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
/* Components */
import { Row } from '@common/components/layout/Row'
import { Column } from '@common/components/layout/Column'
import { Menu } from '@common/components/layout/Menu'
/* Helpers */
import { joinClassNames, removeURLProtocol } from '@common/utils/string'
import { getImageMap } from '@src/utils/wordpress'
import { getMenu } from '@src/utils/system'
import { METADATA } from '@src/constants/system'
import { ImageType } from '@src/constants/wordpress'
import { MenuNames } from '@src/constants/mysql-query'
import type { Image } from '@src/types/wordpress'
/* Assets */
import '@src/scss/banner.scss'

type Props = {
    banner?: {
        title?: string | ReactNode
        excerpt?: string
        icon?: Image
        prefix?: string
        background?: Image
        backgroundColor?: string
    }
    menu: MenuNames
}

/**
 * Banner component that renders a banner with a title, excerpt, icon, and background image.
 *
 * @param {BannerType} props.banner - The banner data.
 * @param {string} props.menu - The menu name to be used in the banner.
 */
export default function Banner(props: Props) {
    const menu = getMenu(props.menu)
    const path = usePathname()

    const title =
        path && METADATA[path] ? METADATA[path].title : props.banner?.title
    const excerpt =
        path && METADATA[path]
            ? METADATA[path].description
            : props.banner?.excerpt

    const style = props.banner?.backgroundColor
        ? {
              backgroundColor: props.banner.backgroundColor,
          }
        : {}

    const imageMapBackground = props.banner?.background
        ? getImageMap(ImageType.HEADER, props.banner.background.sizes)
        : null

    const imageMapIcon = props.banner?.icon
        ? getImageMap(ImageType.ICON, props.banner.icon.sizes)
        : null

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

                {imageMapBackground && (
                    <picture className="banner__background">
                        {imageMapBackground.map((map) => (
                            <source
                                key={`header-${map.file}`}
                                media={map.key}
                                srcSet={map.file}
                                type={props.banner!.background!.mimeType}
                            />
                        ))}

                        <img
                            alt=""
                            role="presentation"
                            src={removeURLProtocol(
                                props.banner!.background!.url,
                            )}
                        />
                    </picture>
                )}

                <div
                    className={joinClassNames(
                        'banner__header',
                        props.banner?.icon && 'banner__header--with-icon',
                    )}
                >
                    <Row>
                        <Column small={12} className="column--banner__title">
                            <h1 className="banner__title">
                                {props.banner?.prefix ? (
                                    <span className="banner__title__tag">
                                        {props.banner.prefix}
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

            {imageMapIcon && (
                <picture className="banner__icon__container">
                    {imageMapIcon.map((map) => (
                        <source
                            key={`icon-${map.file}`}
                            media={map.key}
                            srcSet={map.file}
                            type={props.banner!.icon!.mimeType}
                        />
                    ))}

                    <img
                        alt=""
                        className="banner__icon"
                        role="presentation"
                        src={removeURLProtocol(props.banner!.icon!.url)}
                    />
                </picture>
            )}
        </Fragment>
    )
}
