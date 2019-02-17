var Sequelize = require('sequelize');
var bcrypt = require('bcrypt');

// create a sequelize instance with our local postgres database information.
var sequelize = new Sequelize('postgres://postgres@localhost:5432/auth-system');

// setup User model and its fields.
var Workout = sequelize.define('workout', {
    date: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    type: {
        type: Sequelize.CHAR,
        allowNull: false
    },
    time_length: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    notes: {
        type: Sequelize.TEXT,
        allowNull: false
    }
});

// create all the defined tables in the specified database.
sequelize.sync()
    .then(() => console.log('workout table has been successfully created, if one doesn\'t exist'))
    .catch(error => console.log('This error occured', error));

// export User model for use in other files.
module.exports = Workout;