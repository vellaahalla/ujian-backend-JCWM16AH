const { response } = require("express");
const jwt = require("jsonwebtoken");
const pool = require('../config/db.js');
const md5 = require('md5')
// status 1 = active
// status 2 = deactive
// status 3 = closed
// ROLE 1 = ADMIN
// ROLE 2 = USER

//Token Register
//Token ADMIN (Username: vellaahalla) =  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlblVpZCI6MTYyNzE4NDgwNTAxNSwidG9rZW5Sb2xlIjoxLCJpYXQiOjE2MjcxODQ4MDUsImV4cCI6MTYyNzIyODAwNX0.a-bXMh6lThxpr4qC-xfG0YEnNzc2Z_FqEK6bE8ACba0
//Token USER (Username: andifirdaus) = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlblVpZCI6MTYyNzE4NDkyNDAxOSwidG9rZW5Sb2xlIjoyLCJpYXQiOjE2MjcxODQ5MjQsImV4cCI6MTYyNzIyODEyNH0.57UtrgWJzWUTc4-lleKuYY9liKXVf5w6WtJMOZecyrE
//TOKEN USER TEST ROLE USER (Username: usertest ) = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlblVpZCI6MTYyNzE4NTAwODkxMCwidG9rZW5Sb2xlIjoxLCJpYXQiOjE2MjcxODUwMDgsImV4cCI6MTYyNzIyODIwOH0.JhwvsREoLv52UPZ4G70yYOvWBsjds8Fehagv2XnMVsE

//Token Login
//Token ADMIN (Username: vellaahalla) = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlblVpZCI6IjE2MjcxODQ4MDUwMTUiLCJ0b2tlblJvbGUiOjEsImlhdCI6MTYyNzE4NDg1NSwiZXhwIjoxNjI3MjI4MDU1fQ.cdswt4rw54w9NQVpFqFo6WMu28tNarbYjE3HTrQIhz8
//Token USER (Username: andifirdaus) = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlblVpZCI6IjE2MjcxODQ5MjQwMTkiLCJ0b2tlblJvbGUiOjIsImlhdCI6MTYyNzE4NDk0OCwiZXhwIjoxNjI3MjI4MTQ4fQ.TCVnHVwjK1lOHb3ksJLusz_RXf6rmyPv4cZH9CpKVgU
//TOKEN USER TEST ROLE USER (Username: usertest ) = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlblVpZCI6IjE2MjcxODUwMDg5MTAiLCJ0b2tlblJvbGUiOjEsImlhdCI6MTYyNzE4NTAzOSwiZXhwIjoxNjI3MjI4MjM5fQ.9gD2L3EiyG80WMW3zMZ4hyWlxsBqbvyCXSXd80dfv3Y

const checkRegister = async (req, res, next) => {
    try {
        const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const passRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;
        const data = {
            email: req.body.email,
            username: req.body.username,
            password: req.body.password
        }

        new Promise(function (resolve, reject) {
            console.log(data.username)
            var sql = `select * from users where email = '${data.email}' or username = '${data.username}' `;
            pool.query(sql, (err, result) => {
                if (err) reject(err);

                resolve(result);
                // console.log(result)

                if (result.length > 0) {
                    return res.send({
                        message:
                            "User accont has been registered. Please use different email and username",
                    });
                } else {
                    if (
                        data.username.length >= 6 &&
                        emailRegex.test(data.email) &&
                        passRegex.test(data.password)
                    ) {
                        next();
                    } else {
                        return res.send({
                            message:
                                "Invalid Information. Email has to be valid. Username must contain minimum 6 characters. Password must contain minum 6 characters, a number, and a special character",
                        });
                    }
                }
            });
        });

        console.log(emailRegex.test(data.email))
        console.log(passRegex.test(data.password))

    } catch (err) {
        console.log(err);
        return res.send(err.message);
    }
};

const checkLogin = async (req, res, next) => {
    try {

        const data = {
            user: req.body.user,
            password: md5(req.body.password)
        }

        new Promise(function (resolve, reject) {
            console.log(data.username)
            console.log(data.password)
           
            var sql = `SELECT * FROM users WHERE password = '${data.password}' AND username='${data.user}' OR email='${data.user}'`;
            pool.query(sql, (err, result) => {
                if (err) reject(err);

                resolve(result);

                console.log(result)

                const status = result[0].status

                if (status === 1) {
                    return next();
                } else if (status === 2) {
                    return res.send({
                        message:
                            "Your account status is deactivated. Please activate your account before login",
                        status: "DEACTIVATED",
                    });
                } else if (status === 3) {
                    return res.send({
                        message: "Your account status is closed. Please use different account to login",
                        status: "CLOSED",
                    });
                }
            });
        });

    } catch (err) {
        console.log(err);
        return res.send(err.message);
    };
}

const checkAdmin = async (req, res, next) => {
	try {
		jwt.verify(req.body.token, "secretKey", (err, decoded) => {
			if (err) {
				return res.status(401).send({
					message: err.message,
					status: "Unauthorized",
				});
			} else {
				req.user = decoded;
                console.log(req.user.tokenRole)

				if (req.user.tokenRole === 1) {
					return next();
				} else {
					return res.send({
						message: "You're not allowed to perform this action",
					});
				}
			}
		});
	} catch (err) {
		console.log(err);
		return res.send(err.message);
	}
};

module.exports = { checkRegister, checkLogin, checkAdmin };