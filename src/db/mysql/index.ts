import { default as mysqld } from 'promise-mysql'
import type { Nullable } from '@common/types'
import { isEmpty } from '@common/utils/object'

export class MySQL {
    private mysql: Nullable<mysqld.Connection>
    private static _instance: MySQL
    public static getInstance(): MySQL {
        return this._instance || (this._instance = new this())
    }

    private async init(): Promise<mysqld.Connection> {
        return await mysqld.createConnection({
            host: process.env.MYSQL || 'localhost',
            user: process.env.MYSQL_USER || 'MYSQL_USER',
            password: process.env.MYSQL_PASSWORD || 'MYSQL_PASSWORD',
            database: process.env.MYSQL_DB || 'wordpress',
            port: 3306,
        })
    }

    public async select<T>(
        query: string,
        defaultValue: T[] = [],
    ): Promise<T[]> {
        if (!this.mysql) {
            this.mysql = await this.init().catch((e) => {
                console.error('🤬 MySQL connection failed.')
                console.error(e)
                return undefined
            })
        }

        if (!this.mysql) {
            return defaultValue
        }

        const result = await this.mysql
            .query<T[]>(query)
            .then((data) => {
                if (isEmpty(data)) {
                    return defaultValue
                }
                return data
            })
            .catch(() => {
                return defaultValue
            })

        return result
    }

    public async selectOne<T>(query: string): Promise<T> {
        const selection = await this.select<T>(query).then((result) => {
            if (isEmpty(result)) {
                throw Error(
                    `🤬 MySQL selectOne is failed because the result is empty.`,
                )
            }
            return result[0]
        })
        return selection
    }

    public async update(query: string): Promise<void> {
        if (!this.mysql) {
            this.mysql = await this.init().catch(() => {
                throw new Error('🤬 MySQL connection failed.')
            })
        }
        await this.mysql.query(query)
    }
}
