var User = require('../models/user');

// GET Redirect to Login View
exports.index = function(req, res) {
    res.redirect('/login');
};

// GET Sign Up View
exports.signup_get = function(req, res) {
     res.render('signup');
};

// POST Sign Up Form
exports.signup_post = function(req, res) {
     User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    .then(user => {
        req.session.user = user.dataValues;
        res.redirect('/dashboard');
    })
    .catch(error => {
        res.redirect('/signup');
    });
};

// GET Login View
exports.login_get = function(req, res) {
    res.render('login');
};

// POST Login Form
exports.login_post = function(req, res) {
    var username = req.body.username,
        password = req.body.password;

    User.findOne({ where: { username: username } }).then(function (user) {
        if (!user) {
            res.redirect('/login');
        } else if (!user.password) {
            res.redirect('/login');
        } else {
            req.session.user = user.dataValues;
            res.redirect('/dashboard');
        }
    });
};

// GET Dashboard View if in session.
exports.dashboard_get = function(req, res){
     if (req.session.user && req.cookies.user_sid) {
        res.render('dashboard', {username: req.session.user.username});
    } else {
        res.redirect('/login');
    }
}

// GET Logout
exports.logout_get = function(req, res) {
    if (req.session.user && req.cookies.user_sid) {
        res.clearCookie('user_sid');
        res.redirect('/');
    } else {
        res.redirect('/login');
    }
};