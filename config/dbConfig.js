const mongoose = require('mongoose');

function connectDB(){
    mongoose.connect('mongodb+srv://ahmadsaber298:G44ZfFWp5xg2FXOd@cluster0.psekrmx.mongodb.net/schoolManagement?retryWrites=true&w=majority');
    mongoose.connection.once('connected', () => console.log('Connected To DB'));
}

module.exports = { connectDB };