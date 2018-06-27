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

			const foundCup = doc.cups.find(cup => cup.uid === req.params.cupId);

			const retVal = {
				type: doc.prefs[0].type,
				cream: doc.prefs[0].cream,
				sugar: doc.prefs[0].sugar,
				size: foundCup.size,
			}

			res.send(retVal);
		})
		.catch(err => {
			res.send(err);
		});
});

module.exports = router;
