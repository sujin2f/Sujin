import React, { Fragment, JSX } from 'react'

import { Menu } from 'src/common/components/layout/Menu'
import { ImageType } from 'src/constants/wp'
import { MenuNames } from 'src/constants/mysql-query'
import { Loading } from 'src/frontend/components/Loading'
import { getImageMap } from 'src/utils/common'
import { useMenu } from 'src/frontend/hooks/useMenu'
import { Image } from 'src/types/wordpress'
import { Row } from 'src/common/components/layout/Row'
import { Column } from 'src/common/components/layout/Column'

import 'src/frontend/scss/banner.scss'
import { removeURLProtocol } from 'src/common/utils/string'

type Props = {
    readonly background?: Image
    readonly title?: string | JSX.Element
    readonly excerpt?: string
    readonly isLoading?: boolean
    readonly icon?: Image
    readonly prefix?: string
    readonly backgroundColor?: string
}

export function Banner(props: Props) {
    const {
        background,
        title,
        excerpt,
        isLoading,
        icon,
        prefix,
        backgroundColor,
    } = props
    const { menu: menuMain } = useMenu(MenuNames.MAIN)

    if (isLoading) {
        return (
            <section className="banner loading">
                <div className="banner__overlay">
                    <Loading />

                    <Menu
                        className="show-for-large row menu--banner"
                        items={menuMain}
                    />
                </div>
            </section>
        )
    }

    // @todo
    const style = {
        backgroundColor: backgroundColor || '',
    }

    const imageMapBackground = background
        ? getImageMap(ImageType.HEADER, background.sizes)
        : []

    const imageMapIcon = icon ? getImageMap(ImageType.ICON, icon.sizes) : []
    return (
        <Fragment>
            <section className="banner" style={style}>
                <div className="show-for-large menu__container--banner">
                    <Row>
                        <Column small={12}>
                            <Menu items={menuMain} />
                        </Column>
                    </Row>
                </div>

                <div className="banner__overlay"></div>

                {background && (
                    <picture className="banner__background">
                        {imageMapBackground.map((map) => (
                            <source
                                key={`header-${map.file}`}
                                media={map.key}
                                srcSet={map.file}
                                type={background?.mimeType}
                            />
                        ))}

                        <img
                            alt=""
                            role="presentation"
                            src={removeURLProtocol(background.url)}
                        />
                    </picture>
                )}

                <div className="banner__header">
                    <Row>
                        <Column small={12} className="column--banner__title">
                            <h1 className="banner__title">
                                {prefix ? (
                                    <span className="banner__title__tag">
                                        {prefix}
                                    </span>
                                ) : null}

                                {title}
                            </h1>

                            <p
                                className="banner__excerpt"
                                dangerouslySetInnerHTML={{
                                    __html: excerpt || '',
                                }}
                            />
                        </Column>
                    </Row>
                </div>
            </section>

            {icon ? (
                <picture className="banner__icon__container">
                    {imageMapIcon.map((map) => (
                        <source
                            key={`icon-${map.file}`}
                            media={map.key}
                            srcSet={map.file}
                            type={icon?.mimeType}
                        />
                    ))}

                    <img
                        alt=""
                        className="banner__icon"
                        role="presentation"
                        src={removeURLProtocol(icon.url)}
                    />
                </picture>
            ) : null}
        </Fragment>
    )
}
