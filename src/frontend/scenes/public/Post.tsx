/*
 * Post Component
 * scenes/public/Post
 * domain.com/2020/01/01/slug
 */

import React, { Fragment } from 'react'
import { useParams } from 'react-router-dom'

import { Content } from 'src/frontend/components/single/Content'
import { NotFound } from 'src/frontend/scenes/public/NotFound'
import { usePost } from 'src/frontend/store/hooks/single'
import { Post as TypePost } from 'src/types'

interface Props {
    backgroundImage: string
    hideFrontFooter: boolean
    hideFrontHeader: boolean
    isPending: string
    post: TypePost
}

export const Post = (): JSX.Element => {
    const { slug } = useParams<{ slug: string }>()
    const post = usePost(slug)
    // const leftRail = useLeftRail()

    if (post && 'Failed' === post.date) {
        return <NotFound />
    }

    if (!post || 'Loading' === post.date) {
        return <Fragment />
    }

    // const { prevNext, related, tags, title, excerpt, thumbnail } = post

    return (
        <Fragment>
            {/* <div className="columns small-12 medium-3 layout__article__left">
                {Object.keys(leftRail).map((leftRailTitle: string) => (
                    <Fragment key={`leftrail-${leftRailTitle}`}>
                        <h2 className="section-header">
                            <span>{leftRailTitle}</span>
                        </h2>
                        <ul className="layout__article__left__widget">
                            {Object.keys(leftRail[leftRailTitle]).map(
                                (itemTitle: string) => (
                                    <li
                                        key={`leftrail-${leftRailTitle}-${itemTitle}`}
                                    >
                                        <Link
                                            to={
                                                leftRail[leftRailTitle][
                                                    itemTitle
                                                ]
                                            }
                                        >
                                            {itemTitle}
                                        </Link>
                                    </li>
                                ),
                            )}
                        </ul>
                    </Fragment>
                ))}
            </div>
            */}

            <Content post={post} className="columns small-12 large-6">
                {/* <Tags items={tags} prefix={`single-${slug}`} /> */}
                {/* <SocialShare
                    title={title}
                    excerpt={excerpt}
                    thumbnail={thumbnail!}
                /> */}
                {/* <PrevNext prevNext={prevNext} />
                <RelatedPosts items={related} /> */}
            </Content>

            <aside className="columns small-12 large-3 layout__article__right">
                {/* <SingleAside /> */}
            </aside>
        </Fragment>
    )
}
