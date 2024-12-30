import React, { Fragment } from 'react'

import { Menu } from 'src/common/components/layout/Menu'

import { ImageType } from 'src/constants/wp'
import { MenuNames } from 'src/constants/mysql-query'

import { Loading } from 'src/frontend/components/Loading'
import { getImageMap } from 'src/utils/common'

import { useMenu } from 'src/frontend/hooks/useMenu'

require('src/frontend/scss/banner.scss')

type Props = {
    background?: string
    title?: string | JSX.Element
    excerpt?: string
    isLoading?: boolean
    icon?: string
    prefix?: string
    backgroundColor?: string
}

export const Banner = (props: Props): JSX.Element => {
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
                        slug={MenuNames.MAIN}
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
                <div className="banner__overlay">
                    <Menu
                        className="show-for-large menu__container--banner"
                        items={menuMain}
                    />
                    <div className="banner__title">
                        <h1 className="banner__title__heading">
                            {prefix && (
                                <span className="banner__title__tag">
                                    {prefix}
                                </span>
                            )}
                            {title}
                        </h1>
                        <p
                            className="banner__title__excerpt"
                            dangerouslySetInnerHTML={{
                                __html: excerpt,
                            }}
                        />
                    </div>
                </div>
                <picture>
                    {imageMapBackground.map((map) => (
                        <source
                            key={`header-${map.file}`}
                            media={map.key}
                            srcSet={map.file}
                            type={background?.mimeType}
                        />
                    ))}
                    <img
                        src={background?.url}
                        role="presentation"
                        alt=""
                        className="layout__header__image"
                    />
                </picture>
            </section>
            {icon && (
                <picture>
                    {imageMapIcon.map((map) => (
                        <source
                            key={`icon-${map.file}`}
                            media={map.key}
                            srcSet={map.file}
                            type={icon?.mimeType}
                        />
                    ))}
                    <img
                        src={icon?.url}
                        role="presentation"
                        alt=""
                        className="layout__header__icon"
                    />
                </picture>
            )}
        </Fragment>
    )
}
