import mysqld, { type ProcedureCallPacket } from 'mysql2/promise'
import { isEmpty } from '@common/utils/object'
import { DatabaseError } from '@common/model/Error'
import Logger from '@common/model/Logger'

export default class MySQL {
    private mysql?: Promise<mysqld.Connection>
    private static _instance: MySQL
    public static getInstance(): MySQL {
        return this._instance || (this._instance = new this())
    }

    private async init(): Promise<mysqld.Connection> {
        if (this.mysql) return this.mysql

        this.mysql = mysqld.createConnection({
            host: process.env.MYSQL || 'localhost',
            user: process.env.MYSQL_USER || 'MYSQL_USER',
            password: process.env.MYSQL_PASSWORD || 'MYSQL_PASSWORD',
            database: process.env.MYSQL_DB || 'wordpress',
            port: 3306,
        })

        if (!this.mysql) throw new DatabaseError('🤬 Failed to connect MySQL')
        return this.mysql
    }

    public async select<T>(query: string) {
        const mysql = await this.init().catch((e) => {
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

    public async update(query: string): Promise<void> {
        const mysql = await this.init().catch((e) => {
            Logger.server(e.message)
            return undefined
        })

        if (!mysql) {
            return
        }

        await mysql.query(query)
    }
}
