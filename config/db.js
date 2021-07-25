const mysql = require ('mysql');

const pool = mysql.createPool({
    connectionLimit: 100,
    host: 'localhost',
    user: 'root',
    password: 'Vella171509',
    database: 'backend_2021',
    port: '3306'
})

module.exports = pool;