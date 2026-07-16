const app = require('./app')
const config = require('./config')
const logger = require('./common/logger')
const gracefulShutdown = require('./common/helpers/graceful-shutdown')

const server = app.listen(config.server.port, config.server.host, () => {
    logger.info(
        `${config.application.name} is running at http://${config.server.host}:${config.server.port}`
    )
})

gracefulShutdown(server)
