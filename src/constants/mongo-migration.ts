import { MigrateIndex } from '@common/data/mongo/mongo'

export const mongoMigration: MigrateIndex = {
    '10.2.1': {
        post: {
            drop: [[{ id: 1 }], [{ slug: 1 }]],
            create: [[{ slug: 1 }, { unique: true }]],
        },
        page: {
            create: [[{ slug: 1 }, { unique: true }], [{ date: 1 }]],
        },
        backgrounds: {
            create: [[{ id: 1 }, { unique: true }]],
        },
    },
    '10.1.1': {
        post: {
            create: [
                [{ slug: 1 }],
                [{ date: 1 }],
                [{ id: 1 }, { unique: true }],
            ],
        },
        term: {
            create: [
                [{ slug: 1 }, { unique: true }],
                [{ type: 1 }],
                [{ id: 1 }, { unique: true }],
            ],
        },
        options: {
            create: [[{ key: 1 }, { unique: true }]],
        },
        spectra: {
            create: [[{ number: 1 }], [{ ion: 1 }]],
        },
        user: {
            create: [[{ email: 1 }, { unique: true }]],
        },
    },
}
