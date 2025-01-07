// yarn test object-type.spec.ts

import { GraphQLObjectType, GraphQLString } from './object-type'

describe('object-type.ts', () => {
    it('GraphQLObjectType()', () => {
        const User = new GraphQLObjectType({
            name: 'User',
            fields: {
                id: { type: GraphQLString, required: true },
                name: { type: GraphQLString },
                email: { type: GraphQLString },
            },
        })

        const Post = new GraphQLObjectType({
            name: 'Post',
            fields: {
                id: { type: GraphQLString },
                title: { type: GraphQLString },
                author: { type: User, list: true },
            },
        })

        expect(User.toString().includes('type User {')).toBeTruthy()
        expect(User.toString().includes('id: String!')).toBeTruthy()
        expect(User.toString().includes('name: String')).toBeTruthy()
        expect(Post.toString().includes('type Post {')).toBeTruthy()
        expect(Post.toString().includes('author: [User]')).toBeTruthy()
    })
})
