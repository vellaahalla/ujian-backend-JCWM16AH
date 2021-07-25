const pool = require('../config/db.js');
const _ = require("lodash");

exports.getAllMovies = () => {
    return new Promise(function (resolve, reject) {
        var sql = 'SELECT m.name,m.release_date,m.release_month,m.release_year,m.duration_min,m.genre,m.description, ms.status,l.location,st.time FROM movies m JOIN movie_status ms ON m.status = ms.id JOIN schedules s ON s.movie_id = m.id JOIN locations l ON l.id = s.location_id JOIN show_times st ON st.id = s.time_id;';
        pool.query(sql, (err, result) => {
            if (err) reject(err);

            resolve(result);
            console.log(result)
        });
    });
};

exports.getMoviesByQuery = (data) => {
    return new Promise(function (resolve, reject) {
        let sql = 'SELECT m.name,m.release_date,m.release_month,m.release_year,m.duration_min,m.genre,m.description, ms.status,l.location,st.time FROM movies m JOIN movie_status ms ON m.status = ms.id JOIN schedules s ON s.movie_id = m.id JOIN locations l ON l.id = s.location_id JOIN show_times st ON st.id = s.time_id';

        if (!_.isEmpty(data)) {
            sql += " WHERE";
            console.log(data.location)

            if (data.status && data.location && data.time) {
                const newStatus = data.status.split("%").join(" ");
                const newTime = data.time.split("%").join(" ");
                sql += ` ms.status = '${newStatus}' AND l.location = '${data.location}' AND st.time = '${newTime}'`;
            } else {
                length = data.length;
                console.log(length)
                l = 1;
                if (data.status!= undefined ) {
                    const newStatus = data.status.split("%").join(" ");
                    if (length > l) {
                        sql += ` ms.status = '${newStatus}' AND`;
                        l++;
                    } else {
                        sql += ` ms.status = '${newStatus}'`;
                    }
                }
                if (data.location!= undefined) {
                    if (length > l) {
                        sql += ` l.location = '${data.location}' AND`;
                        l++;
                    } else {
                        sql += ` l.location = '${data.location}'`;
                    }
                }
                if (data.time != undefined) {
                    const newTime = data.time.split("%").join(" ");
                    if (length > l) {
                        sql += ` st.time = '${newTime}' AND`;
                        l++;
                    } else {
                        sql += ` st.time = '${newTime}'`;
                    }
                }
            }
        }

        pool.query(sql,[data],(err, result) => {
            if (err) reject(err);

            resolve(result);
        });
    });

};

exports.addNewMovies = (data) => {
    return new Promise(function (resolve, reject) {
        var sql = `INSERT INTO movies (name,release_date,release_month,release_year,duration_min,genre,description) VALUES ('${data.name}', '${data.release_date}', '${data.release_month}','${data.release_year}','${data.duration_min}','${data.genre}','${data.description}')`;
        pool.query(sql, (err, result) => {
            if (err) reject(err);

            resolve(result);
        });
    });
};

exports.updeStatusMovies = (data) => {
    return new Promise(function (resolve, reject) {
        var sql = `UPDATE movies SET status = ${data.status} WHERE id=${(data.id)}`;
        pool.query(sql, (err, result) => {
            if (err) reject(err);

            resolve(result);
        });
    });
};

exports.addScheduleMovies = (data) => {
    return new Promise(function (resolve, reject) {
        console.log(data.location_id)
        var sql = `INSERT INTO schedules (movie_id,location_id,time_id) VALUES (${data.id},${data.location_id},${data.time_id})`;
        pool.query(sql, (err, result) => {
            if (err) reject(err);

            resolve(true);
        });
    });
};