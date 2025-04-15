import type { PropsWithChildren } from 'react'
/* Helpers */
import { parseContent } from '@app/(single)/utils'
import type { T_Post, T_Page } from '@app/_lib/types'

type Props = {
    post: T_Post | T_Page
    type: 'page' | 'post'
}

export const Content = (props: PropsWithChildren<Props>) => {
    const {
        post: { id, slug, content },
        type,
        children,
    } = props

    const contents = [...parseContent(content)]

    return (
        <>
            <article
                className={`content--${type} content--${decodeURIComponent(
                    slug,
                )} content--post-${id} content`}
            >
                {contents}
            </article>
            <footer className="content__footer">{children}</footer>
        </>
    )
}
