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
			if (!doc) return res.send({ error: 1 });

			const foundCup = doc.cups.find(cup => cup.uid === req.params.cupId);

			const response = {
				type: doc.prefs[0].type,
				cream: doc.prefs[0].cream,
				size: foundCup.size,
			};

			res.send(response);
		})
		.catch(err => {
			res.send(err);
		});
});

module.exports = router;
