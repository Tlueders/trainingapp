var pg = require('pg');
var Workout = require('../models/workout');

// DB Connection for node-postgres
const pool = new pg.Pool({
    user: 'tlueders',
    host: 'localhost',
    database: 'auth-system',
    password: 'root',
    port: '5432'
});

// GET create workout view if in session.
exports.workout_view_get = function(req, res){
     if (req.session.user && req.cookies.user_sid) {
        res.render('create');
    } else {
        res.redirect('/login');
    }
};

// POST create workout
exports.workout_post = function(req, res){
    Workout.create({
        date: req.body.date,
        type: req.body.type,
        time_length: req.body.time_length,
        notes: req.body.notes
    })
    .then(user => {
        req.session.user = user.dataValues;
        res.redirect('/workouts');
    })
    .catch(error => {
        res.redirect('/create');
    });
};

// GET all workouts
exports.workout_get = function(req, res, next) {
    if (req.session.user && req.cookies.user_sid) {
        pool.query('SELECT * FROM workouts;', (err, response, rows) => {
        if(err) {
            console.log(err);
        }
        res.render('workouts', {data: response.rows});
        });
    } else {
        res.redirect('/login');
    }
};