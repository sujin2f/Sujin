'use client'

import React, { use } from 'react'

import { TermTypes } from '@src/types/wordpress'
import { ParamPromise } from '@app/(archive)'
import { Archive } from '@app/(archive)/main'

export default function Search({ params }: ParamPromise) {
    const { slug } = use(params)
    return <Archive type={TermTypes.search} slug={slug} page={1} />
}
