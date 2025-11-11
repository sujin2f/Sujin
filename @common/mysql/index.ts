import mysqld, { type ProcedureCallPacket } from 'mysql2/promise'
import { isEmpty } from '@sujin/share/utils/object'
import Logger from '@sujin/share/model/Logger'

interface MySQLCache {
    connection?: mysqld.Connection
    promise?: Promise<mysqld.Connection>
}
declare global {
    var mysql: MySQLCache
}

let cached = global.mysql
if (!cached) {
    cached = global.mysql = { connection: undefined, promise: undefined }
}

const connect = async (): Promise<mysqld.Connection> => {
    if (cached.connection) {
        return cached.connection
    }

    if (!cached.promise) {
        cached.promise = mysqld.createConnection({
            host: process.env.MYSQL || 'localhost',
            user: process.env.MYSQL_USER || 'MYSQL_USER',
            password: process.env.MYSQL_PASSWORD || 'MYSQL_PASSWORD',
            database: process.env.MYSQL_DB || 'wordpress',
            port: 3306,
        })
    }
    cached.connection = await cached.promise
    return cached.connection
}

export const select = async <T>(query: string) => {
    const mysql = await connect().catch((e) => {
        Logger.server(e.message)
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
    const mysql = await connect().catch((e) => {
        Logger.server(e.message)
        return undefined
    })

    if (!mysql) {
        return
    }

    await mysql.query(query)
}
