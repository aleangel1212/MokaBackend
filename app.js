const express = require('express');
const mongoose = require('./db/mongoose');
const bodyParser = require('body-parser');

const app = express();

const AuthRoutes = require('./routes/auth-routes');
const UserRoutes = require('./routes/users-routes');

app.use(bodyParser.json());

app.use('/auth', AuthRoutes);
app.use('/users', UserRoutes);

app.listen(3000, () => {
	console.log('Listening on port 3000');
});
