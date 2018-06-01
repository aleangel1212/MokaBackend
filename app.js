/* eslint no-unused-vars: 0 */

const express = require('express');
const mongoose = require('./db/mongoose');
const bodyParser = require('body-parser');

const app = express();

const AuthRoutes = require('./routes/auth-routes');
const UserRoutes = require('./routes/users-routes');
const CoffeeRoutes = require('./routes/coffee-routes');

app.use(bodyParser.json());

app.use('/auth', AuthRoutes);
app.use('/users', UserRoutes);
app.use('/coffee', CoffeeRoutes);

app.listen(3000, () => {
	console.log('Listening on port 3000');
});
