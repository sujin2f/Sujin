import { default as mysqld } from 'promise-mysql'
import { Nullable } from 'src/types/common'
import { cached } from 'src/utils/node-cache'

export class MySQL {
    private mysql: Nullable<mysqld.Connection>
    private static _instance: MySQL
    public static getInstance(): MySQL {
        return this._instance || (this._instance = new this())
    }

    private async init(): Promise<mysqld.Connection> {
        return await mysqld.createConnection({
            host: process.env.MYSQL,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DB,
        })
    }

    public async query<T>(query: string, defaultValue: T[]): Promise<T[]> {
        const cache = cached.get<T[]>(query)
        if (cache) {
            if ((cache as unknown as string) == 'NOT EXIST') {
                return defaultValue
            }
            return cache
        }

        if (!this.mysql) {
            this.mysql = await this.init().catch(() => {
                console.error('🤬 MySQL connection failed.')
                return undefined
            })
        }

        if (!this.mysql) {
            return defaultValue
        }

        const ttl = process.env.MYSQL_CACHE_TTL
            ? parseInt(process.env.MYSQL_CACHE_TTL)
            : 0

        const result = await this.mysql
            .query<T[]>(query)
            .then((data) => {
                return data && data.length ? data : defaultValue
            })
            .catch(() => {
                cached.set<string>(query, 'NOT EXIST', ttl)
                return defaultValue
            })

        if (ttl) {
            cached.set<T[]>(query, result, ttl)
        }

        return result
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
