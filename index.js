const express = require('express')
const app = express()
const port = process.env.PORT || 8080
const router = require('./routes')
const { connectDB } = require('./config/dbConfig');
const { setSwagger } = require('./utils/utils');

async function run() {
  try {
    connectDB();
    setSwagger();
    app.use(router)
    app.listen(port, () => {
        console.log(`Listening on port ${port}`);
    })
  } catch (error) {
    console.log('Initialization error', error)
    process.exit(1)
  }
}

run()