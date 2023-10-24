const mongoose = require('mongoose');

function connectDB(){
    mongoose.connect('mongodb://localhost:27017/schoolManagement');
    mongoose.connection.once('connected', () => console.log('Connected To DB'));
}

module.exports = { connectDB };