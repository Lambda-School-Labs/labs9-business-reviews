const express = require('express');
const md5 = require('md5');
const router = express.Router();
const bcrypt = require('bcryptjs');
const userModel = require('../db/userModel/userModel');
const passport = require('passport');
const authConfig = require('./authConfig');
const {
  randomBytes
} = require('crypto');
const {
  promisify
} = require('util');
const db = require('../db/dbinit');

router.get('/', async (req, res) => {
  const response = await userModel.getUsers();
  res.status(200).json(response);
});

router.post('/register', authConfig.checkCreds, async (req, res) => {
  const hash = bcrypt.hashSync(req.body.password, 3);
  req.body.password = hash;

  //http://en.gravatar.com/site/implement/images/ getting gravatar docs
  const email = req.body.email;
  email.toLowerCase();
  const gravatarHashedEmail = await md5(email);
  const gravatarLink = `https://www.gravatar.com/avatar/${gravatarHashedEmail}?s=200`;
  req.body.gravatar = gravatarLink;
  const registerUserId = await userModel.register(req.body);
  if (!registerUserId)
    return res
      .status(500)
      .json({
        message: `User with email ${email} already exists!`
      });
  const [singleUser] = await userModel.verifyLoginEmail(email);
  req.login(singleUser.id, function (err) {
    if (err) {
      return res.status(500).json({
        message: 'Internal server error'
      });
    }
    res.json({
      message: 'Done',
      id: singleUser.id
    });
  });
});

router.post(
  '/login',
  authConfig.alreadyLoggedIn,
  passport.authenticate('local', {
    successMessage: 'done',
    failureMessage: 'nope'
  }),
  (req, res) => {
    if (req.user) {
      return res.json({
        user: req.user
      });
    }
    res.json({
      message: 'internal server error'
    });
  }
);

router.get('/me', async (req, res) => {
  if (!req.user) {
    return res.json('No user logged in please login');
  }
  res.json({
    user: req.user
  });
});

router.get('/logout', authConfig.isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy();
  res.json({
    message: 'Bye!'
  });
});

router.get('/:id', async (req, res) => {
  const [singleUser] = await userModel.getUserById(req.params.id);
  if (!singleUser) res.status(500).json({
    message: 'No user found'
  });
  res.status(200).json({
    singleUser
  });
});

router.put('/:id', async (req, res) => {
  if (req.body.email){
    const email = req.body.email;
    const emailExists = await userModel.verifyLoginEmail(email);
    const DoesEmailExist = emailExists.length > 0 ? true : false;
    if (DoesEmailExist) {
      return res.json({
        error: 'Email Already Exists'
      });
    }
    email.toLowerCase();
    const gravatarHashedEmail = await md5(email);
    const gravatarLink = `https://www.gravatar.com/avatar/${gravatarHashedEmail}?s=200`;
    req.body.gravatar = gravatarLink;
  }
  
  await userModel.updateUser(req.params.id, req.body);
  res.json({
    message: 'Successfully updated'
  });
});

router.post('/verify', async (req, res) => {
  const email = req.body.email;
  const emailExists = await userModel.verifyLoginEmail(email);
  const [singleUser] = [...emailExists];
  const DoesEmailExist = emailExists.length > 0 ? true : false;
  if (!DoesEmailExist) {
    return res.json({
      error: 'email does not exist'
    });
  }
  const promisifiedRandomBytes = promisify(randomBytes);
  singleUser.reset_token = (await promisifiedRandomBytes(20)).toString('hex');
  await userModel.updateUser(singleUser.id, singleUser);
  res.json({
    id: singleUser.reset_token
  });
});

router.get('/tokenuser/:token', async (req, res) => {
  const [user] = await userModel.getByResetToken(req.params.token);
  res.json({
    user
  });
});

router.put('/updatepassword/:id', async (req, res) => {
  const [user] = await userModel.getUserById(req.params.id);
  const hash = bcrypt.hashSync(req.body.password, 3);
  user.password = hash;
  user.reset_token = null;
  try {
    await userModel.updateUser(user.id, user);
    res.json({
      message: 'Updated the user'
    });
  } catch (err) {
    res.json({
      error: 'not authenticated'
    });
  }
});
router.delete('/:id', async (req, res) => {
  const count = await userModel.deleteUser(req.params.id);
  res.status(204).json(count);
});

router.get('/:id/reviews', (req, res) => {
  const {
    id
  } = req.params;
  db('reviews')
    .where({
      reviewer_id: id
    })
    .then(reviews => {
      res.status(200).json(reviews);
    })
    .catch(err => res.status(500).json(err));
});
module.exports = router;