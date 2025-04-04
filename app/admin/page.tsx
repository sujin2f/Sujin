import { MONGO_DATABASE, VERSION } from '@common/constants/helper'
import getSystemOption from '@src/db/mongo/admin/getSystemOption'
/* Models */
import Mongo from '@common/data/mongo/mongo'
import Logger from '@common/model/Logger'
import client from '@common/data/mongo/mongo-client'
/* Components */
import { Button } from '@common/components/forms/Button'
/* Constants */
import migration from '@src/constants/mongo/migration'
/* Utils */
import { compareVersions } from '@common/utils/system'
import setSystemOption from '@src/db/mongo/admin/setSystemOption'

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
        <>
            <h2>Admin</h2>
            <dl>
                <dt>DB | Code Version</dt>
                <dd>
                    {current} | {VERSION}
                </dd>

                <dt>Mongo Database</dt>
                <dd>{MONGO_DATABASE}</dd>
            </dl>

            {compareVersions(VERSION, current) === 1 && (
                <Button onClick={migrate}>Migrate MongoDB</Button>
            )}
            <Button onClick={reset}>Reset MongoDB</Button>
        </>
    )
}
