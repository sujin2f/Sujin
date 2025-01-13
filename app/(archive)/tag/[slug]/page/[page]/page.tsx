'use client'

import React, { use } from 'react'

import { TermTypes } from '@src/types/wordpress'
import { ParamPromise } from '@app/(archive)'
import { Archive } from '@app/(archive)/main'

export default function Tag({ params }: ParamPromise) {
    const { slug, page } = use(params)
    return <Archive type={TermTypes.search} slug={slug} page={parseInt(page)} />
}
