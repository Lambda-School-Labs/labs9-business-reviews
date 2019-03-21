require('dotenv').config();
// require('dotenv').config({ path: '../../.env' });

const express = require('express');
const cookieParser = require('cookie-parser');
const authMiddleware = require('./authMiddlewares');
const userRouter = require('./user/userRouter');
const reviewRouter = require('./reviews/reviewRouter');
const businessRouter = require('./businesses/businessRouter');
const stripeRouter = require('./stripe/stripeRouter');
const cors = require('cors');

const server = express();
const port = process.env.PORT || 9000;

// uncomment this when on development on localhost:3000 //
// server.use(cors({ credentials: true, origin: 'http://localhost:3000' }));

// process.env.NODE_ENV === "production"
//   ? server.use(
//       cors({ credentials: true, origin: 'https://bonafind.netlify.com' })
//     )
//   : server.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
// use this cors on production //
server.use(
  cors({
    credentials: true,
    origin: 'https://objective-curie-345595.netlify.com',
    AccessControlAllowOrigin: 'https://arcane-headland-99879.herokuapp.com'
  })
);

server.use(cookieParser());
authMiddleware(server);
server.use(express.json());

// R O U T E S
server.use('/api/business', businessRouter);
server.use('/api/user', userRouter);
server.use('/api/review', reviewRouter);
server.use('/api/billing', stripeRouter);
require('./user/passport');

// R O O T  R O U T E
server.get('/', (req, res) => {
  res.status(200).json({ api: 'API root' });
});

server.listen(port, () => {
  console.log(`port running on ${port}`);
});

module.exports = server;