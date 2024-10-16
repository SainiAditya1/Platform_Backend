const express = require('express');
const dotenv = require('dotenv');
const sessions = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');

dotenv.config({ path: '.env' });

if (
  !process.env.PORT ||
  !process.env.SESSION_SECRET ||
  !process.env.CLIENT_URL
) {
  console.error('❌ Error: .env file missing required environment variables.');
  process.exit(1);
}

require('./db/database');

const registerRouter = require('./routes/register');
const loginRouter = require('./routes/login');
const adminRouter = require('./routes/admin');
const bookingRoutes = require('./routes/booking');
const profileRoutes = require('./routes/profile');

const PORT = process.env.PORT;
const SESSION_SECRET = process.env.SESSION_SECRET;
const CLIENT_URL = process.env.CLIENT_URL;
const ONEWEEK = 1000 * 60 * 60 * 24 * 7;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  sessions({
    secret: SESSION_SECRET,
    saveUninitialized: true,
    cookie: { maxAge: ONEWEEK, sameSite: 'lax' },
    resave: false,
  })
);

app.use(cookieParser());

// console.log(CLIENT_URL);
// app.use(
//   cors({
//     origin: CLIENT_URL,
//     credentials: true,
//   })
// );


const allowedOrigins = [
  'https://platform-frontend-i6vxzmr4b-sainiaditya1s-projects.vercel.app',
  'https://platform-frontend-eta.vercel.app',
  'localhost:3000'
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

app.use('/api/login', loginRouter);
app.use('/api/register', registerRouter);
app.use('/api/booking', bookingRoutes);
app.use('/api/admin', adminRouter);
app.use('/api/profile', profileRoutes);

app.get('/', (_, res) => {
  res.json({ message: 'Server Set Up Successfully (Health Check)' });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
