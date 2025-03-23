import { MigrateIndex } from '@common/data/mongo/mongo'

export const mongoMigration: MigrateIndex = {
    '10.1.1': {
        post: {
            create: [
                [{ slug: 1 }],
                [{ date: 1 }],
                [{ id: 1 }, { unique: true }],
            ],
        },
    },
}
