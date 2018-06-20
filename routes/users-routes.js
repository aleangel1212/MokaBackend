const express = require('express');
const bcrypt = require('bcryptjs');
const _ = require('lodash');

const authenticate = require('../middleware/authenticate');

const User = require('../models/user');

const router = express.Router();

router.get('/', (req, res) => {
	User.find({})
		.then(docs => {
			res.send(docs);
		})
		.catch(err => {
			res.send(err);
		});
});

router.post('/', (req, res) => {
	const body = _.pick(req.body, ['name', 'email', 'password']);

	const user = new User(body);

	user
		.save()
		.then(doc => {
			const token = doc.generateAuthToken();

			res.send({ token });
		})
		.catch(err => {
			res.send(err);
		});
});

router.get('/me', authenticate, (req, res) => {
	res.send(req.user);
});

router.patch('/me', authenticate, (req, res) => {
	const update = _.pick(req.body, [
		'name',
		'email',
		'password',
		'cups',
		'prefs',
		'cards',
	]);

	if (update.password) {
		const salt = bcrypt.genSaltSync(10);
		update.password = bcrypt.hashSync(update.password, salt);
	}

	const options = { new: true };

	User.findOneAndUpdate({ _id: req.user._id }, { $set: update }, options)
		.then(doc => {
			res.send(doc);
		})
		.catch(err => {
			res.send(err);
		});
});

router.delete('/me', authenticate, (req, res) => {
	User.findOneAndRemove({ _id: req.user._id })
		.then(doc => {
			res.send(doc);
		})
		.catch(err => res.send(err));
});

module.exports = router;
