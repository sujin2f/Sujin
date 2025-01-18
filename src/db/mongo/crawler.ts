import Mongo from '@src/db/mongo/connect'

type Crawler = {
    number: number
    ion: number
    result: boolean
}

const insertOne = async (crawler: Crawler) =>
    await Mongo.insertOne('crawler', crawler)

const findOne = async (number: number, ion: number) =>
    await Mongo.findOne('crawler', { number, ion })

const actions = {
    findOne,
    insertOne,
}

export default actions
