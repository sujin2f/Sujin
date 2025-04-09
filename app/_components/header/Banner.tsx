'use client'
import type { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
/* Components */
import { Row } from '@common/components/layout/Row'
import { Column } from '@common/components/layout/Column'
import { Menu } from '@common/components/layout/Menu'
import NextImage from '@common/components/containers/NextImage'
import { MENU_NAMES } from '@app/_lib/types'
/* Helpers */
import { joinClassNames } from '@common/utils/string'
import { getBannerImageMap } from '@app/_lib/data/mysql/utils'
import { MENUS, METADATA } from '@app/_lib/constants'
/* Types */
import type { T_ImageBlock } from '@app/_lib/types'

type Props = {
    banner?: {
        title?: string | ReactNode
        excerpt?: string
        icon?: T_ImageBlock
        prefix?: string
        background?: T_ImageBlock
        backgroundColor?: string
    }
    menu?: MENU_NAMES
}

/**
 * Banner component that renders a banner with a title, excerpt, icon, and background image.
 *
 * @param {BannerType} props.banner - The banner data.
 * @param {string} props.menu - The menu name to be used in the banner.
 */
export function Banner(props: Props) {
    const menu = MENUS[props.menu || MENU_NAMES.MAIN]
    const path = usePathname()
    const { background, backgroundColor, icon } = props.banner || {}

    const title =
        path && METADATA[path] ? METADATA[path].title : props.banner?.title
    const excerpt =
        path && METADATA[path]
            ? METADATA[path].description
            : props.banner?.excerpt

    const style = backgroundColor
        ? {
              backgroundColor,
          }
        : {}

    return (
        <>
            <section className="banner" style={style}>
                <div className="show-for-large menu__container--banner">
                    <Row>
                        <Column small={12}>
                            <Menu items={menu} />
                        </Column>
                    </Row>
                </div>

                <div className="banner__overlay"></div>

                {background && background.url ? (
                    <NextImage
                        sources={getBannerImageMap(background)}
                        src={background.url}
                        alt=""
                        width={background.width || 1000}
                        height={background.height || 700}
                        className="banner__background"
                    />
                ) : null}

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
