const ApiResponse = require('../response/api-response')

function notFound(req, res) {
    return ApiResponse.error(res, 404, `Route '${req.originalUrl}' not found.`)
}

module.exports = notFound
