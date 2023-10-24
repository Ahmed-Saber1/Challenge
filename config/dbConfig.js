const mongoose = require('mongoose');
const connectionString = process.env.CONNECTIONSTRING;

function connectDB(){
    mongoose.connect(connectionString);
    mongoose.connection.once('connected', () => console.log('Connected To DB'));
}

module.exports = { connectDB };