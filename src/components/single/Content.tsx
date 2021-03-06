/*
 * Content Component
 * components/single/Content
 */

import React, { useEffect, useContext } from 'react'

import { Carousel } from 'components/single/Carousel'
import { CLASS_NAME } from 'constants/dom'
import { Context } from 'store'
import { setLeftRail } from 'store/actions'
import { Post } from 'store/items/post'
import { parseContent, parseSeries } from 'utils/single'

interface Props {
  post: Post
  className?: string
  children?: JSX.Element|JSX.Element[]|undefined
}

export const Content = (props: Props): JSX.Element => {
  const {
    post: {
      id,
      slug,
      content,
      series,
      type,
    },
    className,
    children,
  } = props

  const [, dispatch] = useContext(Context) as Context
  const contents = [
    ...parseContent(content),
  ]

  useEffect((): void => {
    dispatch(setLeftRail(parseSeries(id, series)))

    const carousels = document.getElementsByClassName(CLASS_NAME.carousel.CAROUSEL)

    if (carousels.length === 0) {
      return
    }

    Array.from(carousels).forEach((element: Element): void => {
      if (element.getAttribute('data-loaded')) {
        return
      }
      // tslint:disable-next-line: no-unused-expression
      new Carousel(element)
      element.setAttribute('data-loaded', 'loaded')
    })
  }, [dispatch, id, series])

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
