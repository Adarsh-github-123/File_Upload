const {Datatypes} = require('sequelize');
const {createDB} = require('../config/db');

const User = createDB.define("users", {
    id:{
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        type: Datatypes.INTEGER
    }, 
    name: Datatypes.STRING,
    email: Datatypes.STRING,
    password: Datatypes.STRING,

    isSeller: {
        type: Datatypes.BOOLEAN,
        defaultValue: false
    }
});

module.exports = User;