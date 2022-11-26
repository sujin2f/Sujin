import { default as mysqld } from 'promise-mysql'
import { DAY_IN_SECONDS } from 'src/common/constants/datetime'
import { isEmpty } from 'src/common/utils/object'
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

    public async select<T>(
        query: string,
        defaultValue: T[] = [],
        cacheTtl = 0,
    ): Promise<T[]> {
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

        const result = await this.mysql
            .query<T[]>(query)
            .then((data) => {
                if (isEmpty(data)) {
                    return defaultValue
                }
                return data
            })
            .catch(() => {
                cached.set<string>(query, 'NOT EXIST', DAY_IN_SECONDS)
                return defaultValue
            })

        cached.set<T[]>(query, result, DAY_IN_SECONDS)
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
