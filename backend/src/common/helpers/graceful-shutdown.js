const logger = require('../logger')

function gracefulShutdown(server) {
    function shutdown(signal) {
        logger.info(`${signal} received. Shutting down gracefully...`)

        server.close(() => {
            logger.info('HTTP server closed.')

            // Future:
            // await database.close();

            process.exit(0)
        })
    }

    process.on('SIGINT', () => shutdown('SIGINT'))
    process.on('SIGTERM', () => shutdown('SIGTERM'))
}

module.exports = gracefulShutdown
