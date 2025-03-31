import type { User } from 'next-auth'
import Mongo from '@common/data/mongo/mongo'

const addUser = async (user: User) => await Mongo.insertOne<User>('user', user)

export default addUser
