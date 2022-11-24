import { default as mysqld } from 'promise-mysql'
import { Nullable } from 'src/types/common'
import { cached } from 'src/utils/node-cache'

interface mySQL {
    query: <T>(query: string, defaultValue: T) => Promise<T>
}

export class MySQL implements mySQL {
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

    public async query<T>(query: string, defaultValue: T): Promise<T> {
        console.log(query)
        const cache = cached.get<T>(query)
        if (cache) {
            if ((cache as unknown as string) == 'NOT EXIST') {
                console.error('🤬 MySQL result is not found: ${query}')
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

        const result = await this.mysql
            .query<T>(query)
            .then((data) => data || defaultValue)
            .catch(() => {
                cached.set<string>(query, 'NOT EXIST', ttl)
                console.error(`🤬 MySQL result is not found: ${query}`)
                return defaultValue
            })
        console.log(result)

        const ttl = process.env.MYSQL_CACHE_TTL
            ? parseInt(process.env.MYSQL_CACHE_TTL)
            : 0

        if (ttl) {
            cached.set<T>(query, result, ttl)
        }

        return result
    }
}
