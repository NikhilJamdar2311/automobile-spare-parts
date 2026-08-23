const ApiError = require('../error/api-error')
const { verifyToken } = require('../helpers/jwt.helper')
const authRepository = require('../../modules/auth/auth.repository')

async function authenticate(req, res, next) {
    try {
        const authorization = req.headers.authorization

        if (!authorization) {
            throw new ApiError(401, 'Authentication token is required.')
        }

        const [scheme, token] = authorization.split(' ')

        if (scheme !== 'Bearer' || !token) {
            throw new ApiError(401, 'Invalid authentication token format.')
        }

        let decodedToken

        try {
            decodedToken = verifyToken(token)
        } catch {
            throw new ApiError(401, 'Invalid or expired authentication token.')
        }

        const user = await authRepository.findById(decodedToken.id)

        if (!user) {
            throw new ApiError(401, 'User associated with the token was not found.')
        }

        if (!user.isActive) {
            throw new ApiError(403, 'Your account has been deactivated.')
        }

        req.user = {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
        }

        next()
    } catch (error) {
        next(error)
    }
}

module.exports = authenticate
