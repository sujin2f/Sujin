import React from 'react'
/* Components */
import { PrevNext as Component } from '@app/_components/single/PrevNext'
/* Utils */
import { getCachedPrevNext } from '@app/_lib/data/mongo/wordpress/post'
/* Assets */
import './style.scss'

interface PostProps {
    slug: string
}

export const PrevNext = async ({ slug }: PostProps) => {
    const [prev, next] = await getCachedPrevNext(slug)
    if (!prev && !next) return <></>
    return <Component prev={prev} next={next} />
}
