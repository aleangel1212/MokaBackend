const User = require('../models/user');

const authenticate = (req, res, next) => {
	const token = req.header('x-auth');

	User.findByToken(token)
		.then(doc => {
			req.user = doc;
			req.token = token;
			next();
		})
		.catch(err => {
			res.status(400).send(err);
		});
};

module.exports = authenticate;
