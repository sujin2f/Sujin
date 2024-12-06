import { default as mysqld } from 'promise-mysql'
import { isEmpty } from 'src/common/utils/object'
import { Nullable } from 'src/types/common'

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
            port: 3307,
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

    public async selectOne<T>(query: string): Promise<Nullable<T>> {
        const selection = await this.select<T>(query)
        if (isEmpty(selection)) {
            return
        }
        return selection[0]
    }

    public async update(query: string): Promise<void> {
        if (!this.mysql) {
            this.mysql = await this.init().catch(() => {
                console.error('🤬 MySQL connection failed.')
                throw new Error('🤬 MySQL connection failed.')
            })
        }
        await this.mysql.query(query)
    }
}
