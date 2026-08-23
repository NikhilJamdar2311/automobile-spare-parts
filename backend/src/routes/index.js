const express = require('express')
const router = express.Router()
const healthRoute = require('./health.route')
const authRoute = require('./auth.route')

router.use('/health', healthRoute)
router.use('/auth', authRoute)

module.exports = router
