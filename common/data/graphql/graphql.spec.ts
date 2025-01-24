// yarn test graphql/graphql.spec.ts

import { GQLQuery } from './query'
import { GQLInt, GQLType, GQLString, GQLBoolean } from './type'
import { createGQLOptions } from './createExpressRouter'
import { GQLMutation } from './mutation'

type UserType = {
    id?: number
}

type PostType = {
    user: UserType
}

type ListType = {
    posts: PostType[]
}

type ResultType = {
    result: boolean
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

    const Result = new GQLType<ResultType>('Result', {
        result: { type: GQLBoolean },
    })
    const addUser = new GQLMutation<[number], ResultType>(
        'addUser',
        {
            id: { type: GQLInt, required: true },
        },
        { type: Result },
    )

    test('GQLType', () => {
        expect(User.toString().includes('type User {')).toBeTruthy()
        expect(Post.toString().includes('user: User!')).toBeTruthy()
        expect(Post.toString().includes('related: Post')).toBeTruthy()
        expect(List.toString().includes('posts: [Post]')).toBeTruthy()
    })

    test('GQLQuery.toString()', () => {
        expect(getList.toString()).toEqual('getList(id: String!): List')
    })

    test('GQLQuery.toOperation()', () => {
        const operation1 = getList.toOperation('id name', 32)
        expect(
            operation1.includes('{"query":"{\\ngetList(id: 32)'),
        ).toBeTruthy()
        const operation2 = addUser.toOperation('id', 32)
        console.log(operation1, operation2)
        expect(
            operation2.includes('{"mutation":"{\\naddUser(id: 32)'),
        ).toBeTruthy()
    })

    test('GQLQuery.setCallback() & createExpressRouter', () => {
        const callback1 = async (id: number): Promise<ListType> =>
            ({
                posts: [
                    {
                        user: {
                            id,
                        },
                    },
                ],
            } as ListType)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const callback2 = async (_: number): Promise<ResultType> =>
            ({
                result: true,
            } as ResultType)

        const router = createGQLOptions(
            getList.setCallback(callback1),
            addUser.setCallback(callback2),
            User,
            Post,
            List,
        )

        expect(
            router.schema.includes('getList(id: String!): List'),
        ).toBeTruthy()
        expect(
            router.schema.includes('type Mutation{\naddUser(id: Int!): Result'),
        ).toBeTruthy()
    })
})
