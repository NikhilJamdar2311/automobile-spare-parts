const env = require('./env')

const logger = Object.freeze({
    level: env.logLevel,
})

module.exports = logger
