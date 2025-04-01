import Mongo from '@common/data/mongo/mongo'

const removePost = async (slug: string) =>
    await Mongo.deleteOne('page', { slug })

export default removePost
