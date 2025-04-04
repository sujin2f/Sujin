import type { User } from 'next-auth'
import Mongo from '@common/data/mongo/mongo'
import { COLLECTION } from '@app/helpers/constants/mongo'

const addUser = async (user: User) =>
    await Mongo.insertOne<User>(COLLECTION.USERS, user)

export default addUser
