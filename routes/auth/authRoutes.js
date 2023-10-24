const router = require('express').Router();
const { createAccount, getToken } = require('../../controllers/authentication');

router.post('/createAccount', createAccount)

router.get('/getToken', getToken)

module.exports = router;