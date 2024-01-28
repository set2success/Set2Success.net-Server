const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
require('dotenv').config();
const api = require('./routes/api');
const myHooks = require('./routes/webhooks');
const app = express();

const PORT = process.env.PORT || 4001;
const URI = process.env.Database_URI;
const SESSION_PASSWORD = process.env.SESSION_PASSWORD;

//! Middleware
// Use the cors middleware to allow cross-origin requests
app.use(cors());
// app.use(express.json());

// app.use(bodyParser.json());
// app.use(bodyParser.raw({ type: 'application/json' }));

//! MONGOOSE CONNECTION
mongoose
    .connect(URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('Database Connected ✅');
    })
    .catch((error) => {
        console.log('Database not connected', error);
    });

//! SESSION SETUP
// Use express-session middleware to save session data
app.use(
    session({
        secret: SESSION_PASSWORD,
        resave: false,
        saveUninitialized: true,
        cookie: {
            httpOnly: true,
            // secure: true //for https not for localhost
            // 1000 milliseconds
            expires: Date.now * 1000 * 60 * 60 * 24,
            maxAge: 1000 * 60 * 60 * 24,
        },
    }),
);

// app.use(express.json());
app.use(cookieParser());

//! API'S
app.use('/hook', myHooks);
app.use('/', api);

// const myRoutes = require('./routes/myRoute');
// app.use(myRoutes);

//! PORT CONNECTION
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
