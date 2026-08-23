const env = require('./env')

const database = Object.freeze({
    url: env.databaseUrl,
    dialect: 'postgres',
    logging: env.nodeEnv === 'development',
})

module.exports = database
