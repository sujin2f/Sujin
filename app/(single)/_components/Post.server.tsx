import { unstable_cache } from 'next/cache'
import { notFound } from 'next/navigation'
/* Components */
import Wrapper from '@app/_components/Wrapper'
import { Tags } from '@app/(single)/_components/Tags'
import { PrevNext } from '@app/(single)/_components/PrevNext.server'
import { RelatedPosts } from '@app/(single)/_components/RelatedPosts.server'
import { RecentPosts } from '@app/(single)/_components/RecentPosts.server'
import { SocialShare } from '@app/(single)/_components/SocialShare.client'
import Column from '@common/components/layout/Column'
import Row from '@common/components/layout/Row'
import { Content } from '@app/(single)/_components/Content'
import { GoogleAdvert } from '@app/_components/GoogleAdvert'
/* CONSTANTS */
import { VERSION } from '@common/constants/helper'
import { IMAGE_SIZE, POST_STATUS } from '@app/_lib/types'
import { revalidate } from '@app/_lib/constants'
/* Utils */
import { getThumbnailFromPost } from '@app/_lib/data/mysql/utils'
import { isAdmin } from '@app/_lib/data/mongo/user'
import { updateHits } from '@app/archive/_lib/updateHits'
import { getCachedPost } from '@app/(single)/_lib/getCachedPost'
/* Assets */
import { A_Error, NoContentError, UnauthorizedError } from '@common/model/Error'

type Props = {
    slug: string
}

export async function PostServer({ slug }: Props) {
    const request = unstable_cache(
        async (slug) =>
            await getCachedPost(slug)
                .then(async (post) => {
                    if (
                        !(await isAdmin()) &&
                        post.status !== POST_STATUS.PUBLISH
                    ) {
                        throw new UnauthorizedError(
                            'Not Authorized to access this page.',
                        )
                    }
                    return post
                })
                .catch((e) => {
                    if (e instanceof NoContentError) {
                        e.log()
                        notFound()
                    }
                    if (e instanceof A_Error) {
                        e.log()
                    }
                    throw e
                }),
        [slug, VERSION],
        {
            tags: ['wordpress', 'post'],
            revalidate,
        },
    )

    const post = await request(slug)
    const thumbnail = getThumbnailFromPost(post.images, IMAGE_SIZE.MEDIUM_LARGE)
    const tags = post.archives.filter((tag) => tag.type === 'tag')

    // Update Tag Cloud
    if (tags.length && post.status === POST_STATUS.PUBLISH) {
        tags.forEach((tag) => updateHits(tag.slug))
    }

    return (
        <Wrapper
            className={`wrapper--post--${slug} sujin`}
            title={post.title}
            excerpt={post.excerpt}
            icon={post.images?.icon}
            background={post.images?.background}
            backgroundColor={post.meta?.backgroundColor}
        >
            <Row fullWidth>
                <Column medium={12} large={7} largeOffset={2}>
                    <Content post={post} type="post">
                        <Tags items={tags} />
                        <SocialShare
                            title={post.title}
                            excerpt={post.excerpt}
                            thumbnail={thumbnail}
                        />
                        <PrevNext slug={slug} />
                        <RelatedPosts slug={slug} />
                    </Content>
                </Column>

                <Column
                    small={12}
                    large={3}
                    className="layout__article__right"
                    dom="aside"
                >
                    <RecentPosts current={post.id} />
                    <GoogleAdvert responsive place="sidebar" />
                </Column>
            </Row>
        </Wrapper>
    )
}
