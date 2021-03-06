/*
 * SingleAside Component
 * components/single/SingleAside
 */

import React from 'react'

import { WidgetContainer } from 'components/widgets'
import { GlobalVariable } from 'store/items/global-variable'

export const SingleAside = (): JSX.Element => {
  const globalVars = GlobalVariable.getInstance(window.sujin)

  return (
    <WidgetContainer items={globalVars.widgets.siderail} />
  )
}
