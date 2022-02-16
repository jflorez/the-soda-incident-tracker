/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import mariadb from 'mariadb';

export default class DBConnector {
    private pool = mariadb.createPool({
        host: '127.0.0.1',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: 'sodatracker',
        connectionLimit: 5,
        acquireTimeout: 30000,
    });

    async insertIncident(user:string, item:string) {
        const conn = await this.pool.getConnection();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const res = await conn.query('INSERT INTO tracker (user,item) values (?,?)', [user, item]);
        console.log(res);
        if (conn) return conn.end();
    }

    async getLatestIncident(user:string) {
        const conn = await this.pool.getConnection();
        const rows = await conn.query('SELECT user, item, oops FROM tracker WHERE user=? ORDER BY oops DESC LIMIT 1', [user]);
        console.log(rows[0]);
        const ret = {user: rows[0]['user'], item: rows[0]['item'], oops: rows[0]['oops']};
        if (conn) await conn.end();
        return ret;
    }

    async getCurrentIncidents(user: string, item: string) {
        const conn = await this.pool.getConnection();
        const rows = await conn.query('SELECT user, item, oops FROM tracker WHERE user=? AND item=?', [user, item]);
        console.log(rows);
        if (conn) await conn.end();
        return rows;
    }
}
