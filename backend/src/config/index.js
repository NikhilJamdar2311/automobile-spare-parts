const application = require('./application')
const server = require('./server')
const database = require('./database')
const logger = require('./logger')
const env = require('./env')

module.exports = Object.freeze({
    application,
    server,
    database,
    logger,
    env,
})
