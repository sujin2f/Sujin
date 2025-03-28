import type { User } from 'next-auth'
import Mongo from '@common/data/mongo/mongo'

const getUser = async (email: string) =>
    await Mongo.findOne<User>('user', { email })

export default getUser
