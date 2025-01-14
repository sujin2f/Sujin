'use client'

import React, { Fragment } from 'react'

import { Column } from '@common/components/layout/Column'
import { Menu } from '@common/components/layout/Menu'
import { Row } from '@common/components/layout/Row'
import { removeURLProtocol } from '@common/utils/string'
import { ImageType } from '@src/constants/wp'
import { useMenu } from '@src/hooks/useMenu'
import { useContext } from '@src/store'
import { getImageMap } from '@src/utils/common'

import '@src/scss/banner.scss'

export function Banner() {
    const [{ banner, menu: menuSlug }] = useContext()
    const { menu } = useMenu(menuSlug)

    // TODO
    const style = banner.backgroundColor
        ? {
              backgroundColor: banner.backgroundColor,
          }
        : {}

    const imageMapBackground = banner.background
        ? getImageMap(ImageType.HEADER, banner.background.sizes)
        : []

    const imageMapIcon = banner.icon
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

                {banner.background && (
                    <picture className="banner__background">
                        {imageMapBackground.map((map) => (
                            <source
                                key={`header-${map.file}`}
                                media={map.key}
                                srcSet={map.file}
                                type={banner.background.mimeType}
                            />
                        ))}

                        <img
                            alt=""
                            role="presentation"
                            src={removeURLProtocol(banner.background.url)}
                        />
                    </picture>
                )}

                <div className="banner__header">
                    <Row>
                        <Column small={12} className="column--banner__title">
                            <h1 className="banner__title">
                                {banner.prefix ? (
                                    <span className="banner__title__tag">
                                        {banner.prefix}
                                    </span>
                                ) : null}

                                {banner.title}
                            </h1>

                            <p className="banner__excerpt">{banner.excerpt}</p>
                        </Column>
                    </Row>
                </div>
            </section>

            {banner.icon ? (
                <picture className="banner__icon__container">
                    {imageMapIcon.map((map) => (
                        <source
                            key={`icon-${map.file}`}
                            media={map.key}
                            srcSet={map.file}
                            type={banner.icon.mimeType}
                        />
                    ))}

                    <img
                        alt=""
                        className="banner__icon"
                        role="presentation"
                        src={removeURLProtocol(banner.icon.url)}
                    />
                </picture>
            ) : null}
        </Fragment>
    )
}
