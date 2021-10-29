/*
 * Global Header > Top Header Component
 * components/layout/GlobalHeader/TopHeader
 */

import React, { useContext, Fragment } from 'react'
import { MenuNames } from 'src/constants/mysql-query'

import { Loading } from 'src/frontend/components/common/Loading'
import { Menu } from 'src/frontend/components/layout/Menu'
import { Context } from 'src/frontend/store'

export const TopHeader = (): JSX.Element => {
    const [
        {
            pageInfo: {
                background,
                title,
                description,
                isLoading,
                icon,
                prefix,
                backgroundColor,
                useBackgroundColor,
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
        backgroundImage:
            typeof background !== 'string' ? '' : `url(${background})`,
        backgroundSize: useBackgroundColor ? 'contain' : 'cover',
        backgroundColor: backgroundColor || '',
    }

    return (
        <Fragment>
            <section className="layout__header__top" style={style}>
                <div className="overlay">
                    <div className="text row">
                        <div className="columns small-12">
                            <h1>
                                {prefix && <span>{prefix}</span>}
                                {title}
                            </h1>
                            <p
                                dangerouslySetInnerHTML={{
                                    __html: description,
                                }}
                            />
                        </div>
                    </div>

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
            {icon && (
                <img
                    src={icon}
                    alt="Thumbnail"
                    className="layout__header__thumb"
                />
            )}
        </Fragment>
    )
}
