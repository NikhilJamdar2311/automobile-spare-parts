const ApiResponse = require('../response/api-response')
const config = require('../../config')
const logger = require('../logger')

function errorHandler(err, req, res, _next) {
    logger.error(err)

    const statusCode = err.statusCode || 500

    let message = err.message

    if (statusCode >= 500 && config.env.nodeEnv !== 'development') {
        message = 'Internal Server Error'
    }

    return ApiResponse.error(res, statusCode, message, err.errors)
}

module.exports = errorHandler
