import Logger from '@common/model/Logger'

export const ERROR_MESSAGE: Record<string, Record<string, [string, string]>> = {
    // A.[MO:mongo, MY:mysql].nnnn
    ATTACHMENT: {
        DELETE_MANY: ['A.MO.0000', '🤬 Failed to delete backgrounds'],
        INSERT_MANY: ['A.MO.0001', '🤬 Failed to insert backgrounds'],
        EMPTY_POST_META: ['A.MY.0000', '🤬 Failed to get MySQL post_meta'],
        EMPTY_BACKGROUNDS: [
            'A.MY.0001',
            '🤬 Cannot find backgrounds from MySQL',
        ],
    },
    POST: {
        SQL_GET_ONE: ['P.MY.0000', '🤬 Failed to get MySQL post'],
    },
    ARCHIVE: {
        SQL_GET_ONE: ['T.MY.0000', '🤬 Failed to get MySQL term'],
    },
    GENERAL: {
        NONCE_FAILED: ['G.0000', '🤬 GQL Server mutatePage: got invalid nonce'],
    },
}

export class ServerError extends Error {
    public code: string | undefined
    public data: unknown[]
    constructor(_message: [string, string], ...data: unknown[]) {
        const [code, message] = _message
        super(message)
        this.code = code
        this.data = data
        Logger.server(
            message,
            code,
            ...data.map((data) => JSON.stringify(data)),
        )
    }
}
