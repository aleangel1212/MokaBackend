const express = require('express');

const User = require('../models/user');

const router = express.Router();

router.get('/:cupId', (req, res) => {
	User.findOne({
		cups: {
			$elemMatch: {
				uid: req.params.cupId,
			},
		},
	})
		.then(doc => {
			if (!doc) return res.send({ error: 'No cup found' });

			const retVal = doc.prefs[0];
			retVal.size = doc.cups[0].size;

			res.send(retVal);
		})
		.catch(err => {
			res.send(err);
		});
});

module.exports = router;
