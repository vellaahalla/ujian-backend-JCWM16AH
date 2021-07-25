const jwt = require("jsonwebtoken");

const createJWTToken = (payload) => {
	return jwt.sign(payload, "secretKey", { expiresIn: "24h" });
};

const checkToken = (req, res, next) => {
    
	if (req.method !== "OPTIONS") {
        const token = req.body.token
		jwt.verify(token, "secretKey", (err, decoded) => {
			if (err) {
				return res.status(401).send({
					message: err.message,
					status: "Unauthorized",
				});
			}

			req.user = decoded;
            console.log(req.user)
			next();
		});
	}
};

module.exports = {
	createJWTToken,
	checkToken
};