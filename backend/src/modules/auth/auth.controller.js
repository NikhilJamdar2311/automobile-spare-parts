const authService = require('./auth.service')
const ApiResponse = require('../../common/response/api-response')

async function login(req, res, next) {
    try {
        const { email, password } = req.body

        const result = await authService.login(email, password)

        return ApiResponse.success(res, 'Login successful.', result)
    } catch (error) {
        next(error)
    }
}

async function getCurrentUser(req, res) {
    return ApiResponse.success(res, 'Current user retrieved successfully.', {
        user: req.user,
    })
}

async function refreshToken(req, res, next) {
    try {
        const { refreshToken } = req.body

        const result = await authService.refreshAccessToken(refreshToken)

        return ApiResponse.success(res, 'Access token refreshed successfully.', result)
    } catch (error) {
        next(error)
    }
}

module.exports = {
    login,
    getCurrentUser,
    refreshToken,
}
