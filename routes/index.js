const status = require('../controllers/status')
const bodyParser = require('body-parser')
const router = require('express').Router()
const authRouter = require('./auth/authRoutes')
const schoolManagementRouter = require('./schoolManagement/schoolManagementRoutes')
const logger = require('morgan');

router.use(logger('dev'));
router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

router.use('/auth', authRouter);

router.use('/schoolManagement', schoolManagementRouter);

router.get('/status', status)

module.exports = router