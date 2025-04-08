import Logger from '@common/model/Logger'
import { ConstToType } from '@common/types'

// A.[MO:mongo, MY:mysql].nnnn  🤩 Log 😩 Warn 🤬 Fatal
export const ERROR_MESSAGE = {
    ATTACHMENT: {
        DELETE_MANY: ['A.MO.0000', '🤬 Failed to delete backgrounds'],
        INSERT_MANY: ['A.MO.0001', '🤬 Failed to insert backgrounds'],
        EMPTY_POST_META: ['A.MY.0000', '🤬 Failed to get MySQL post_meta'],
        EMPTY_BACKGROUNDS: [
            'A.MY.0001',
            '🤬 Cannot find backgrounds from MySQL',
        ],
    } as const,
    POST: {
        SQL_GET_ONE: ['P.MY.0000', '🤬 Failed to get MySQL post'],
    } as const,
    ARCHIVE: {
        SQL_GET_ONE: ['T.MY.0000', '🤬 Failed to get MySQL term'],
    } as const,
    GENERAL: {
        NONCE_FAILED: ['G.0000', '🤬 GQL Server mutatePage: got invalid nonce'],
        UNAUTHORIZED: ['G.0001', '🤬 Invalid admin access'],
    } as const,
} as const
type ERROR_MESSAGE =
    | ConstToType<typeof ERROR_MESSAGE.ATTACHMENT>
    | ConstToType<typeof ERROR_MESSAGE.POST>
    | ConstToType<typeof ERROR_MESSAGE.ARCHIVE>
    | ConstToType<typeof ERROR_MESSAGE.GENERAL>

export class ServerError extends Error {
    public code: string | undefined
    public data: unknown[]
    constructor(_message: ERROR_MESSAGE, ...data: unknown[]) {
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
