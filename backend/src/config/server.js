const env = require('./env')

const server = Object.freeze({
    host: env.host,
    port: env.port,
})

module.exports = server
