var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');
var pg = require('pg');

// Models
var User = require('./models/user');
var Workout = require('./models/workout');

// Controllers
var user_controller = require('./controllers/userController');
var workout_controller = require('./controllers/workoutController');

// invoke an instance of express application.
var app = express();

// set our application port
app.set('port', 9000);

// Set our view engine
app.set('view engine', 'pug');
app.set('views','./public');

// set morgan to log info about our requests for development use.
app.use(morgan('dev'));

// initialize body-parser to parse incoming parameters requests to req.body
app.use(bodyParser.urlencoded({ extended: true }));

// initialize cookie-parser to allow us access the cookies stored in the browser. 
app.use(cookieParser());

// initialize express-session to allow us track the logged-in user across sessions.
app.use(session({
    key: 'user_sid',
    secret: 'somerandonstuffs',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));

// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
        res.clearCookie('user_sid');        
    }
    next();
});

// middleware function to check for logged-in users
var sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        res.redirect('/dashboard');
    } else {
        next();
    }
};

// Routes for User Authentication
app.get('/', sessionChecker, user_controller.index);
app.get('/login', sessionChecker, user_controller.login_get);
app.post('/login', user_controller.login_post);
app.get('/signup', sessionChecker, user_controller.signup_get);
app.post('/signup', user_controller.signup_post);
app.get('/logout', user_controller.logout_get);

// Route for user's dashboard
app.get('/dashboard', user_controller.dashboard_get);

// Routes for Creating a Workout
app.get('/create', workout_controller.workout_view_get);
app.post('/create', workout_controller.workout_post);
app.get('/workouts', workout_controller.workout_get);


// route for handling 404 requests(unavailable routes)
app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!")
});


// start the express server
app.listen(app.get('port'), () => console.log(`App started on port ${app.get('port')}`));