const md5 = require('md5')
const authModel = require('../model/auth')
// const jwt = require ('../lib/jwt')
const { createJWTToken } = require("../helper/jwt");
const pool = require('../config/db.js');


exports.register = async (req, res) => {

    let data = {
        email: req.body.email,
        username: req.body.username,
        password: md5(req.body.password),
        uid: Date.now(),
        role: 1,
        status: 1
        // role: parseInt(req.body.role),
        // status: parseInt(req.body.status)
    }

    const tokenUid = data.uid
    const tokenRole = data.role
    const token = createJWTToken({ tokenUid, tokenRole });


    authModel.register(data)
        .then(() => {
            res.json({
                status: 'ok',
                message: "Successfully Register",
                data,
                token
            })
        })
        .catch((err) => {
            res.json({
                status: 'error',
                message: "Failed to Register Account",
                error_message: err
            })
        })
}

exports.login = async (req, res) => {
    let data = {
        user: req.body.user,
        password: md5(req.body.password)
    }

    authModel.login(data)
        .then((result) => {
            if (result.length > 0) {

                const { uid, role, status } = result[0];
                const tokenUid = uid
                const tokenRole = role
                const token = createJWTToken({ tokenUid, tokenRole });

                res.json({
                    id: result[0].id,
                    uid,
                    username: result[0].username,
                    email: result[0].email,
                    status,
                    role,
                    token
                })
            } else {
                res.json({
                    status: 'ok',
                    login: false
                })
            }
        })
        .catch((err) => {
            res.json({
                status: 'error',
                error_message: err
            })
        })
}



exports.deactiveAccount = async (req, res) => {
    try {

        new Promise(function (resolve, reject) {
            var sql = `SELECT * FROM users WHERE uid = '${req.user.tokenUid}'`;
            pool.query(sql, (err, result) => {
                if (err) reject(err);

                resolve(result);

                console.log(result)
                const userId = result[0].uid;
                const status = result[0].status;
                if (status === 3) {
                    return res.send({
                        message: "Your account status is closed. You can't perform this action.",
                        status: "closed",
                    });
                } else {

                    new Promise(function (resolve, reject) {
                        
                        var sql = `UPDATE users SET status =2 WHERE uid='${userId}' `;
                        pool.query(sql, (err, result) => {
                            if (err) reject(err);

                            resolve(true);

                            if(result){
                                return res.send({
                                    userId,
                                    status: "deactive"
                                });
                            }


                        });
                    })

                }
            });
        })
    } catch (err) {
        console.log(err);
        res.send(err.message);
    }
};

exports.activateAccount = async (req, res) => {
    try {

        new Promise(function (resolve, reject) {
            var sql = `SELECT * FROM users WHERE uid = '${req.user.tokenUid}'`;
            pool.query(sql, (err, result) => {
                if (err) reject(err);

                resolve(result);

                const userId = result[0].uid;
                const status = result[0].status;
                if (status === 3) {
                    return res.send({
                        message: "Your account status is closed",
                        status: "closed",
                    });
                } else if(status===2) {

                    new Promise(function (resolve, reject) {
                        
                        var sql = `UPDATE users SET status =1 WHERE uid='${userId}' `;
                        pool.query(sql, (err, result) => {
                            if (err) reject(err);

                            resolve(true);

                            if(result){
                                return res.send({
                                    userId,
                                    status: "activate"
                                });
                            }


                        });
                    })

                }
            });
        })
    } catch (err) {
        console.log(err);
        res.send(err.message);
    }
};

exports.closeAccount = async (req, res) => {
    try {

        new Promise(function (resolve, reject) {
            const uid= req.user.tokenUid

            var sql = `UPDATE users SET status = 3 WHERE uid = '${req.user.tokenUid}'`;
            pool.query(sql, (err, result) => {
                if (err) reject(err);

                resolve(true);

                if (result) {
                    return res.send({
                        uid,
                        status: "close"
                    });
                }

  
            });
        })
    } catch (err) {
        console.log(err);
        res.send(err.message);
    }
};

