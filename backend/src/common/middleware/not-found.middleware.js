const ApiResponse = require('../../core/api-response')

function notFound(req, res) {
    return ApiResponse.error(res, 404, `Route '${req.originalUrl}' not found.`)
}

module.exports = notFound
