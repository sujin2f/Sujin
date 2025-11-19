import mysqld, { type ProcedureCallPacket } from 'mysql2/promise'
import { isEmpty } from '@sujin/share/utils/object'
import Logger from '@src/utils/logger'

declare global {
    var mysql: mysqld.Connection | null
}

/**
 * Create or reuse a global MySQL connection.
 *
 * The connection is cached on the `global` object to avoid reconnecting on
 * subsequent calls. On successful connection the function logs an info
 * message. On failure it logs the error and throws.
 *
 * @returns A ready `mysql2/promise` `Connection`.
 */
const mysqlConnect = async (): Promise<mysqld.Connection> => {
    if (global.mysql) {
        return global.mysql
    }

    const connection = mysqld.createConnection({
        host: process.env.MYSQL || 'localhost',
        user: process.env.MYSQL_USER || 'MYSQL_USER',
        password: process.env.MYSQL_PASSWORD || 'MYSQL_PASSWORD',
        database: process.env.MYSQL_DB || 'wordpress',
        port: 3306,
    })

    global.mysql = await connection
        .then((mysql) => {
            Logger.info('🚀 mySQL is ready.')
            return mysql
        })
        .catch((e) => {
            Logger.error(`⛈️ Failed to connect mySQL ${e.message}`)
            throw new Error('')
        })

    return global.mysql
}

/**
 * Close and clear the cached global MySQL connection if present.
 */
export const mysqlDisconnect = async (): Promise<void> => {
    if (!global.mysql) {
        return
    }

    await global.mysql.end()
    global.mysql = null
}

/**
 * Execute a SELECT query and return typed results.
 *
 * The function manages the MySQL connection and returns an empty array on
 * failure to connect or when the query returns no rows.
 *
 * @param query - The SQL query string to execute.
 * @returns An array of results typed as `T[]`.
 */
export const select = async <T>(query: string): Promise<T[]> => {
    const mysql = await mysqlConnect().catch((e) => {
        Logger.error(`⛈️ Failed to connect mySQL from select() ${e.message}`)
        return undefined
    })

    if (!mysql) {
        return []
    }

    const [[result]] = await mysql
        .query<ProcedureCallPacket<T>>(query)
        .then((data) => {
            if (isEmpty(data)) {
                return [[[]]]
            }
            return [data]
        })
        .catch(() => {
            return [[[]]]
        })

    return result as T[]
}

/**
 * Execute an UPDATE/INSERT/DELETE or other non-select SQL statement.
 *
 * @param query - The SQL query string to execute.
 */
export const update = async (query: string): Promise<void> => {
    const mysql = await mysqlConnect().catch((e) => {
        Logger.error(`⛈️ Failed to connect mySQL from update() ${e.message}`)
        return undefined
    })

    if (!mysql) {
        return
    }

    await mysql.query(query)
}
