const bcrypt = require('bcrypt');
const { createUser } = require('../models/createUser');
const signup = (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ error: 'Error hashing password' });
    }
    createUser(username, email, hashedPassword, (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Error saving user to database' });
      }
      res.status(200
         
      ).json({ message: 'Account created successfully' });
    });
  });
};

module.exports = { signup };