const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const _ = require('lodash');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true
  },

  password: {
    type: String,
    required: true
  },

  cards: [
    {
      _id: false,

      nameOnCard: {
        type: String,
        required: true
      },

      billingAddress: {
        type: String,
        required: true
      },

      expDate: {
        type: Date,
        required: true
      },

      cvc: {
        type: String,
        required: true
      }
    }
  ],

  cups: [
    {
      _id: false,

      uid: {
        type: String,
        required: true
      },

      size: {
        type: Number,
        required: true
      }
    }
  ],

  prefs: [
    {
      _id: false,

      type: {
        type: String,
        required: true
      },

      cream: {
        type: Number,
        default: 0
      },

      sugar: {
        type: Number,
        default: 0
      }
    }
  ],

  tokens: [String]
});

UserSchema.statics.findByToken = function(token) {
  return new Promise((resolve, reject) => {
    let decoded;

    if (!token) return reject({ error: 'Please login' });

    try {
      decoded = jwt.verify(token, 'abc123');
    } catch (e) {
      return reject({ error: 'Invalid token, please try logging in again' });
    }

    User.findOne(
      {
        _id: decoded._id,
        tokens: token
      },
      (err, doc) => {
        if (!doc) return reject({ error: 'Please login' });
        if (err) return reject(err);

        resolve(doc);
      }
    );
  });
};

UserSchema.statics.findByEmail = function(email, password) {
  return new Promise((resolve, reject) => {
    User.findOne({ email }, (err, doc) => {
      if (!doc) return reject({ error: 'No user with that email found' });

      if (bcrypt.compareSync(password, doc.password)) return resolve(doc);

      return reject({ error: 'Password or email is incorrect' });
    });
  });
};

UserSchema.methods.generateAuthToken = function() {
  const token = jwt.sign({ _id: this._id }, 'abc123').toString();

  this.tokens.push(token);
  this.save();

  return token;
};

UserSchema.methods.removeToken = function(token) {
  return this.update({
    $pull: {
      tokens: token
    }
  });
};

UserSchema.methods.toJSON = function() {
  const userObject = this.toObject();

  return _.pick(userObject, ['_id', 'name', 'email', 'cups', 'prefs']);
};

UserSchema.pre('save', function(next) {
  if (this.isModified('password')) {
    const salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, salt);
  }

  next();
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
