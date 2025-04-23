import { MONGO_DATABASE, VERSION } from '@common/constants/helper'
/* Components */
import { FrontPageClient } from '@app/admin/front-page-client'
/* Models */
import Logger from '@common/model/Logger'
import Cached from '@common/model/Cached'
/* CONSTANTS */
import migration from '@app/_lib/migration'
/* Utils */
import { getDatabase, migrate as runMigration } from '@common/data/mongo/mongo'
import { compareVersions } from '@common/utils/system'
import { getCachedOption } from '@app/_lib/data/mongo/admin'
import { isAdmin } from '@app/_lib/data/mongo/user'
import { ERROR_MESSAGE, ServerError } from '@app/_lib/constants-error'

export async function FrontPageServer() {
    const current = await getCachedOption('version')
        .then((version) => version || '0.0.0')
        .catch(() => '0.0.0')

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
            const result = await runMigration(current, VERSION, migration)
            if (result.length !== 0) {
                Logger.server(`MongoDB Migrated: ${JSON.stringify(result)}`)
            }
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

        await getDatabase().then(async (database) => {
            // Drop all collections
            await database.collections().then(async (collections) => {
                for (let i = 0; i < collections.length; i++) {
                    await collections[i]
                        .drop()
                        .then(() => {
                            Logger.server(
                                `MongoDB collection ${collections[i].collectionName} dropped`,
                            )
                        })
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
