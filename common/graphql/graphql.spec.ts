// yarn test graphql/graphql.spec.ts

import { GQLQuery } from './query'
import { GQLInt, GQLType, GQLString } from './type'
import { createExpressRouter } from './createExpressRouter'

type UserType = {
    id?: number
}

type PostType = {
    user: UserType
}

type ListType = {
    posts: PostType[]
}

describe('graphql', () => {
    const User = new GQLType<UserType>('User', { id: { type: GQLInt } })
    const Post = new GQLType<PostType>('Post', {
        user: { type: User, required: true },
    })
    const List = new GQLType<ListType>('List', {
        posts: { type: Post, list: true },
    })
    Post.addField('related', { type: Post })

    const getList = new GQLQuery<[number], ListType>(
        'getList',
        { id: { type: GQLString, required: true } },
        { type: List },
    )

    it('GQLType', () => {
        expect(User.toString().includes('type User {')).toBeTruthy()
        expect(Post.toString().includes('user: User!')).toBeTruthy()
        expect(Post.toString().includes('related: Post')).toBeTruthy()
        expect(List.toString().includes('posts: [Post]')).toBeTruthy()
    })

    it('GQLQuery.toString()', () => {
        expect(getList.toString()).toEqual('getList(id: Int!): List')
    })

    it('GQLQuery.toOperation()', () => {
        const operation = getList.toOperation('id name', 32)
        expect(operation.includes('getList(id: 32) {')).toBeTruthy()
    })

    it('GQLQuery.setCallback() & createExpressRouter', () => {
        const callback = async (id: number): Promise<ListType> =>
            ({
                posts: [
                    {
                        user: {
                            id: id,
                        },
                    },
                ],
            }) as ListType
        const router = createExpressRouter(
            getList.setCallback(callback),
            User,
            Post,
            List,
        )
        expect(
            router.toString().includes('function router(req, res, next) {'),
        ).toBeTruthy()
    })
})
