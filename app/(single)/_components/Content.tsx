import type { PropsWithChildren } from 'react'
/* Helpers */
import { parseContent } from '@app/(single)/_lib/utils'
import type { T_Post, T_Page } from '@app/_lib/types'
import { T_Stringify } from '@common/types/mongo'

type Props = {
    post: T_Stringify<T_Post | T_Page>
    type: 'page' | 'post'
}

export const Content = (props: PropsWithChildren<Props>) => {
    const {
        post: { _id, id, slug, content },
        type,
        children,
    } = props

    const contents = [...parseContent(content)]

    return (
        <>
            <article
                className={`content--${type} content--${decodeURIComponent(
                    slug,
                )} content--${type}-${id} content--${_id} content`}
            >
                {contents}
            </article>
            <footer className="content__footer">{children}</footer>
        </>
    )
}
