import { default as mysqld } from 'promise-mysql'
import { Nullable } from 'src/types'

let _mysql: Nullable<mysqld.Connection>

/**
 * MySQL connect
 * @return {Promise<mysqld.Connection>}
 */
export const mysql = async (): Promise<mysqld.Connection> => {
    if (_mysql) {
        return _mysql
    }
    _mysql = await mysqld.createConnection({
        host: process.env.MYSQL,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DB,
    })
    return _mysql
}
