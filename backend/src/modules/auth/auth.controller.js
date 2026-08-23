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

module.exports = {
    login,
}
