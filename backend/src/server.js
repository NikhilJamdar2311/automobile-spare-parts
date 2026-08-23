const app = require('./app')
const config = require('./config')
const logger = require('./common/logger')
const gracefulShutdown = require('./common/helpers/graceful-shutdown')
const database = require('./database')

async function startServer() {
    try {
        await database.connectDatabase()

        const server = app.listen(config.server.port, config.server.host, () => {
            logger.info(
                `${config.application.name} is running at http://${config.server.host}:${config.server.port}`
            )
        })

        gracefulShutdown(server)
    } catch (error) {
        logger.error('Application startup failed.', error)
        process.exit(1)
    }
}

startServer()
