/*
 * Content Component
 * components/single/Content
 */

import React, { useEffect, useContext } from 'react'

import { Carousel } from 'src/frontend/components/single/Carousel'
import { CLASS_NAME } from 'src/frontend/constants/dom'
import { Context } from 'src/frontend/store'
// import { setLeftRail } from 'src/frontend/store/actions'
import { Post, ReactChildrenProps } from 'src/types'
import { parseContent } from 'src/frontend/utils/single'

interface Props extends ReactChildrenProps {
    post: Post
    className?: string
}

export const Content = (props: Props): JSX.Element => {
    const {
        // post: { id, slug, content, series, type },
        post: { id, slug, content, type },
        className,
        children,
    } = props

    // const [, dispatch] = useContext(Context) as Context
    const contents = [...parseContent(content)]

    // useEffect((): void => {
    //     dispatch(setLeftRail(parseSeries(id, series)))

    //     const carousels = document.getElementsByClassName(
    //         CLASS_NAME.carousel.CAROUSEL,
    //     )

    //     if (carousels.length === 0) {
    //         return
    //     }

    //     Array.from(carousels).forEach((element: Element): void => {
    //         if (element.getAttribute('data-loaded')) {
    //             return
    //         }
    //         // tslint:disable-next-line: no-unused-expression
    //         new Carousel(element)
    //         element.setAttribute('data-loaded', 'loaded')
    //     })
    // }, [dispatch, id, series])

    return (
        <article
            className={`${className} ${type}-${slug} post-${id}`}
            itemProp="mainEntity"
            itemType="http://schema.org/BlogPosting"
        >
            {contents}

            <footer className="layout__main__content__footer">
                {children}
            </footer>
        </article>
    )
}
