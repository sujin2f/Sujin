/*
 * Global Header > Top Header Component
 * components/layout/GlobalHeader/TopHeader
 */

import React, { useContext, Fragment } from 'react'
import { ImageType } from 'src/constants'
import { MenuNames } from 'src/constants/mysql-query'

import { Loading, Menu } from 'src/frontend/components'
import { Context } from 'src/frontend/store'
import { getImageMap } from 'src/utils'

export const Banner = (): JSX.Element => {
    const [
        {
            pageInfo: {
                background,
                title,
                excerpt,
                isLoading,
                icon,
                prefix,
                backgroundColor,
            },
        },
    ] = useContext(Context) as Context

    if (isLoading) {
        return (
            <section className="layout__header__top loading">
                <div className="overlay">
                    <Loading />

                    <div className="row menu-container">
                        <section className="columns small-12">
                            <Menu
                                className="show-for-large flex-row menu__top__primary"
                                slug={MenuNames.MAIN}
                            />
                        </section>
                    </div>
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

                    <Menu
                        className="show-for-large row menu--banner"
                        slug={MenuNames.MAIN}
                    />
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
