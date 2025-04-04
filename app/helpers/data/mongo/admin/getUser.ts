import type { User } from 'next-auth'
import Mongo from '@common/data/mongo/mongo'
import { COLLECTION } from '@app/helpers/constants/mongo'

const getUser = async (email: string) =>
    await Mongo.findOne<User>(COLLECTION.USERS, { email })

export default getUser
