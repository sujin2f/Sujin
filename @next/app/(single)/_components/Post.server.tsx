import { notFound } from 'next/navigation'
/* Models */
import { A_Error, NoContentError } from '@sujin/share/model/Error'
/* Components */
import Wrapper from '@app/_components/Wrapper'
import { Tags } from '@app/(single)/_components/Tags'
import { PrevNext } from '@app/(single)/_components/PrevNext.server'
import { RelatedPosts } from '@app/(single)/_components/RelatedPosts.server'
import { RecentPosts } from '@app/(single)/_components/RecentPosts'
import { SocialShare } from '@app/(single)/_components/SocialShare.client'
import Column from '@sujin/common/components/layout/Column'
import Row from '@sujin/common/components/layout/Row'
import { Content } from '@app/(single)/_components/Content'
import { GoogleAdvert } from '@app/_components/GoogleAdvert'
/* CONSTANTS */
import { IMAGE_SIZE, POST_STATUS } from '@app/_lib/types'
/* Utils */
import { getThumbnailFromPost } from '@app/_lib/utils/clients'
import { updateHits } from '@app/_lib/utils/mongo/updateHits'
import { getCachedPost } from '@app/(single)/_lib/getCachedPost'
import { mongoStringify } from '@sujin/common/utils/object'

type Props = {
    slug: string
}

export async function PostServer({ slug }: Props) {
    const post = await getCachedPost(slug).catch((e) => {
        if (e instanceof NoContentError) {
            e.log()
            notFound()
        }
        if (e instanceof A_Error) {
            e.log()
        }
        throw e
    })

    const thumbnail = getThumbnailFromPost(post.images, IMAGE_SIZE.MEDIUM_LARGE)
    const tags = post.archives.filter((tag) => tag.type === 'tag')

    // Update Tag Cloud
    if (tags.length && post.status === POST_STATUS.PUBLISH) {
        tags.forEach((tag) => updateHits(tag.slug))
    }

    return (
        <Wrapper
            title={post.title}
            excerpt={post.excerpt}
            icon={post.images?.icon}
            background={post.images?.background}
            backgroundColor={post.meta?.backgroundColor}
        >
            <Row fullWidth>
                <Column medium={12} large={7} largeOffset={2}>
                    <Content post={mongoStringify(post)} type="post">
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
                    <RecentPosts id={post.id} />
                    <GoogleAdvert responsive place="sidebar" />
                </Column>
            </Row>
        </Wrapper>
    )
}
