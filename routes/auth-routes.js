const express = require('express');
const _ = require('lodash');

const authenticate = require('../middleware/authenticate');

const User = require('../models/user');

const router = express.Router();

router.post('/login', (req, res) => {
	const body = _.pick(req.body, ['email', 'password']);

	User.findByEmail(body.email, body.password)
		.then(doc => {
			const token = doc.generateAuthToken();

			res.send({ token });
		})
		.catch(error => {
			res.status(400).send(error);
		});
});

router.delete('/logout', authenticate, (req, res) => {
	req.user
		.removeToken(req.token)
		.then(() => {
			res.send('Successfully logged out');
		})
		.catch(e => {
			res.status(400).send(e);
		});
});

module.exports = router;
