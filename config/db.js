const {Sequelize} = require('sequelize');

const createDB = new Sequelize('test-db', 'user', 'pass', {
    dialect: 'sqlite',
    host: './config/db.sqlite'
});

const connectDB = () => {
    createDB.sync().then( () => {
        console.log('Db connected Successfully');
    })
    .catch((e) => {
        console.log('db connection failed', e);
    })
}

const userModel = require('../models/userModel');
const orderModel = require('../models/orderModel');

orderModel.belongsTo(userModel, { foreignKey: "buyerId" });
userModel.hasMany(orderModel, { foreignKey: "id" });

module.exports = {createDB, connectDB};