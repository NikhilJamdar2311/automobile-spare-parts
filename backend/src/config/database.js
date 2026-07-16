const env = require('./env')

const database = Object.freeze({
    url: env.databaseUrl,
})

module.exports = database
