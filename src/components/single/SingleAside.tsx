/*
 * SingleAside Component
 * components/single/SingleAside
 */

import React from 'react'

import { WidgetContainer } from 'components/widgets'

export const SingleAside = (): JSX.Element => {
  return (
    <WidgetContainer items={window.sujin.widgets.siderail} />
  )
}
