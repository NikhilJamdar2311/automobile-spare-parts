const ApiResponse = require('../../core/api-response')
const config = require('../../config')
const logger = require('../logger')

function errorHandler(err, req, res, _next) {
    logger.error(err.stack || err.message)

    const statusCode = err.statusCode || 500

    const message = config.env.nodeEnv === 'development' ? err.message : 'Internal Server Error'

    return ApiResponse.error(res, statusCode, message)
}

module.exports = errorHandler
