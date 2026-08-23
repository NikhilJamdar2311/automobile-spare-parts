const authRepository = require('./auth.repository')
const { comparePaasword } = require('../../common/helpers/password.helper')
const { generateToken } = require('../../common/helpers/jwt.helper')
const ApiError = require('../../common/error/api-error')

async function login(email, password) {
    const user = await authRepository.findByEmail(email)

    if (!user) {
        throw new ApiError(401, 'Invalid email or password.')
    }

    if (!user.isActive) {
        throw new ApiError(403, 'Your account has been deactivated.')
    }

    const isPasswordValid = await comparePaasword(password, user.password)

    if (!isPasswordValid) {
        throw new ApiError(401, 'Invalid email or password.')
    }

    const token = generateToken({
        id: user.id,
        email: user.email,
        role: user.role,
    })

    return {
        user: {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
        },
        token,
    }
}

module.exports = {
    login,
}
