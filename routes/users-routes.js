const express = require('express');
const _ = require('lodash');

const authenticate = require('../middleware/authenticate');

const User = require('../models/user');

const router = express.Router();

router.post('/', (req, res) => {
	const body = _.pick(req.body, ['name', 'email', 'password']);

	const user = new User(body);

	user.save((err, doc) => {
		if (err) return res.send(err);

		res.send(doc);
	});
});

router.get('/me', authenticate, (req, res) => {
	res.send(req.user);
});

module.exports = router;
