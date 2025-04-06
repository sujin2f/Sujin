import { MONGO_DATABASE, VERSION } from '@common/constants/helper'
/* Components */
import FrontPage from './FrontPage'
/* Models */
import Mongo from '@common/data/mongo/mongo'
import Logger from '@common/model/Logger'
import client from '@common/data/mongo/mongo-client'
/* Constants */
import migration from '@app/_lib/migration'
/* Utils */
import { compareVersions } from '@common/utils/system'
import { getSystemOption, setSystemOption } from '@app/_lib/data/mongo/admin'

export default async function Admin() {
    const current = (await getSystemOption('version')) || '0.0.0'

    const migrate = async () => {
        'use server'
        // Migrate MongoDB indexes
        if (compareVersions(VERSION, current) === 1) {
            Logger.server(`Migrate MongoDB: current ${current}, new ${VERSION}`)
            const result = await Mongo.migrate(current, VERSION, migration)
            if (result.length !== 0) {
                Logger.server(`MongoDB Migrated: ${JSON.stringify(result)}`)
            }
            await setSystemOption('version', VERSION)
        }
    }

    const reset = async () => {
        'use server'
        await client.then(async (client) => {
            const database = client.db(MONGO_DATABASE)
            // Drop all collections
            await database.collections().then(async (collections) => {
                for (let i = 0; i < collections.length; i++) {
                    await collections[i].drop()
                }
            })
        })
    }

    return (
        <FrontPage
            dbVersion={current}
            codeVersion={VERSION}
            showMigrate={compareVersions(VERSION, current) === 1}
            migrate={migrate}
            reset={reset}
            database={MONGO_DATABASE || ''}
        />
    )
}
