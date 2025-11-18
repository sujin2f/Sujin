import mysqld, { type ProcedureCallPacket } from 'mysql2/promise'
import { isEmpty } from '@sujin/share/utils/object'
import Logger from '@src/utils/logger'

declare global {
    var mysql: mysqld.Connection | null
}

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

export const mysqlDisconnect = async () => {
    if (!global.mysql) {
        return
    }

    await global.mysql.end()
    global.mysql = null
}

export const select = async <T>(query: string) => {
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
