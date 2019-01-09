const express = require('express');
const bcrypt = require('bcryptjs');
const md5 = require('md5');
const router = express.Router();
const userModel = require('./userModel');
const generateToken = require('../generateToken');

router.post('/register', async (req, res) => {
  if (!req.body.name || !req.body.email || !req.body.password) {
    res.json({ message: 'You are missing one of these fields' });
  } else {
    const hash = bcrypt.hashSync(req.body.password, 3);
    req.body.password = hash;

    //http://en.gravatar.com/site/implement/images/ getting gravatar docs
    const email = req.body.email;
    email.toLowerCase();
    console.log(email, 'email');
    const gravatarHashedEmail = await md5(email);
    const gravatarLink = `https://www.gravatar.com/avatar/${gravatarHashedEmail}?s=200`;
    req.body.gravatar = gravatarLink;
    console.log(gravatarLink, 'gravatarlink');
    const registerUserId = await userModel.register(req.body);
    res.json({
      message: `Successfully completed adding a user with id of ${registerUserId}`
    });
  }
});

router.post('/login', async (req, res) => {
  if (req.cookies.tokenId) return res.json({ message: 'Already logged in!' });
  if (!req.body.email)
    return res.json({ message: 'You are missing a email field' });
  if (!req.body.password)
    return res.json({ message: 'You are missing a password field' });
  const [singleUser] = await userModel.verifyLoginEmail(req.body.email);
  if (!singleUser) return res.json({ message: 'No user found!' });
  const comparePasswords = bcrypt.compareSync(
    req.body.password,
    singleUser.password
  );
  if (!comparePasswords)
    return res.status(500).json({ message: 'WRONG PASSWORD' });
  if (singleUser && comparePasswords) {
    //if authenticated return this!
    const tokenId = generateToken(singleUser.id);
    res.cookie('tokenId', tokenId, { httpOnly: true, maxAge: 1000 * 60 * 60 });
    res.json({
      message: `You are now authenticated ${singleUser.name}`,
      singleUser
    });
  }
});

router.get('/me', async (req, res) => {
  if (!req.user) {
    res.json('No user logged in please login');
  }
  res.json(req.user);
});

router.get('/logout', (req, res) => {
  req.clearCookie('tokenId');
  res.json({ message: 'Bye!' });
});
module.exports = router;
