const mariadb = require('mariadb');
const pool = mariadb.createPool({
    host: '127.0.0.1',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'sodatracker',
    connectionLimit: 5,
    acquireTimeout: 30000
});
module.exports.insertIncident = async (user, item) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const res = await conn.query("INSERT INTO tracker (user,item) values (?,?)", [user, item]);
        console.log(res);
    } catch (err) {
        throw err;
    } finally {
        if (conn) return conn.end();
    }
}

module.exports.getLatestIncident = async (user) => {
    let conn;
    let rows=[];
    try {
        conn = await pool.getConnection();
        rows = await conn.query("SELECT user, item, oops FROM tracker WHERE user=? ORDER BY oops DESC LIMIT 1", [user]);
        console.log(rows[0]);
    } catch (err) {
        throw err;
    } finally {
        if (conn) await conn.end();
        const ret = {user: rows[0]['user'], item: rows[0]['item'], oops: rows[0]['oops']};
        return ret;
    }
}