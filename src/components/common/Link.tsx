/*
 * Global Footer Bottom Element Component
 * components/common/Link
 */

import React from 'react'
import { Link as ReactLink } from 'react-router-dom'

import { GlobalVariable } from 'store/items/global-variable'

interface Props {
  children?: string|JSX.Element|JSX.Element[]
  className?: string
  dangerouslySetInnerHTML?: object
  itemType?: string
  rel?: string
  title?: string
  to: string
}

export const Link = (props: Props): JSX.Element => {
  const {
    children,
    className,
    dangerouslySetInnerHTML,
    itemType,
    rel,
    title,
  } = props

  const globalVars = GlobalVariable.getInstance(window.sujin)
  const to = props.to.replace(globalVars.url, '')

  return (
    <ReactLink
      to={to}
      className={className}
      itemType={itemType}
      rel={rel}
      title={title}
      dangerouslySetInnerHTML={dangerouslySetInnerHTML}
    >
      {children}
    </ ReactLink>
  )
}
