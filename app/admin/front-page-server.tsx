import { MONGO_DATABASE, VERSION } from '@common/constants/helper'
/* Components */
import { FrontPageClient } from '@app/admin/front-page-client'
/* Models */
import Mongo from '@common/data/mongo/mongo'
import Logger from '@common/model/Logger'
import client from '@common/data/mongo/mongo-client'
/* CONSTANTS */
import migration from '@app/_lib/migration'
/* Utils */
import { compareVersions } from '@common/utils/system'
import { getSystemOption, setSystemOption } from '@app/_lib/data/mongo/admin'
import { isAdmin } from '@app/_lib/utils-server'
import { ERROR_MESSAGE, ServerError } from '@app/_lib/constants-error'
import Cached from '@common/model/Cached'

export async function FrontPageServer() {
    const current = (await getSystemOption('version')) || '0.0.0'

    const migrate = async (current: string) => {
        'use server'
        if (!(await isAdmin()))
            throw new ServerError(
                ERROR_MESSAGE.GENERAL.UNAUTHORIZED,
                'migration',
            )

        // Migrate MongoDB indexes
        if (compareVersions(VERSION, current) === 1) {
            Logger.server(`Migrate MongoDB: current ${current}, new ${VERSION}`)
            const result = await Mongo.migrate(
                current,
                VERSION,
                migration,
            ).catch((e) => {
                console.log(e)
                return e.message
            })
            if (result.length !== 0) {
                Logger.server(`MongoDB Migrated: ${JSON.stringify(result)}`)
            }
            await setSystemOption('version', VERSION).catch((e) => e.message)
            return 'Done.'
        }
        return 'Nothing to migrate.'
    }

    const reset = async () => {
        'use server'
        if (!(await isAdmin()))
            throw new ServerError(
                ERROR_MESSAGE.GENERAL.UNAUTHORIZED,
                'migration',
            )

        await client.then(async (client) => {
            const database = client.db(MONGO_DATABASE)
            // Drop all collections
            await database.collections().then(async (collections) => {
                for (let i = 0; i < collections.length; i++) {
                    await collections[i]
                        .drop()
                        .catch((e) => JSON.parse(e.message))
                }
            })
            await Cached.getInstance().flush()
        })
        return 'Done.'
    }

    return (
        <FrontPageClient
            dbVersion={current}
            codeVersion={VERSION}
            showMigrate={compareVersions(VERSION, current) === 1}
            migrate={migrate}
            reset={reset}
            database={MONGO_DATABASE || ''}
        />
    )
}
