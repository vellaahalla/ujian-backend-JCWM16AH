const pool = require('../config/db.js');

exports.register = (data) => {
    return new Promise(function (resolve, reject) {
        var sql = 'insert into users set ?';
        pool.query(sql, [data], (err, result) => {
            if (err) reject(err);

            resolve(true);
        });
    });
};

exports.login = (data) => {
    return new Promise(function (resolve, reject) {
        console.log(data.user)
        var sql = `SELECT * FROM users WHERE password = '${data.password}' AND username ='${data.user}' OR email = '${data.user}' `;
        pool.query(sql, (err, result) => {
            if (err) reject(err);

            resolve(result);


        });
    });
};




