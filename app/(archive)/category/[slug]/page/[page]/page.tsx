'use client'

import React, { use } from 'react'

import { TermTypes } from '@src/types/wordpress'
import { ParamPromise } from '@app/(archive)'
import { Archive } from '@app/(archive)/main'

export default function Category({ params }: ParamPromise) {
    const { slug, page } = use(params)
    return (
        <Archive type={TermTypes.category} slug={slug} page={parseInt(page)} />
    )
}
