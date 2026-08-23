jest.mock('../../src/common/helpers/jwt.helper', () => ({
    verifyToken: jest.fn(),
}))

jest.mock('../../src/modules/auth/auth.repository', () => ({
    findById: jest.fn(),
}))

const { verifyToken } = require('../../src/common/helpers/jwt.helper')
const authRepository = require('../../src/modules/auth/auth.repository')
const authenticate = require('../../src/common/middleware/auth.middleware')

describe('authenticate middleware', () => {
    const res = {}

    beforeEach(() => {
        jest.clearAllMocks()
    })

    test('should authenticate a valid active user', async () => {
        const req = {
            headers: {
                authorization: 'Bearer valid-token',
            },
        }

        const next = jest.fn()

        verifyToken.mockReturnValue({
            id: 1,
            email: 'tk@gmail.com',
            role: 'admin',
        })

        authRepository.findById.mockResolvedValue({
            id: 1,
            fullName: 'TK',
            email: 'tk@gmail.com',
            role: 'admin',
            isActive: true,
        })

        await authenticate(req, res, next)

        expect(verifyToken).toHaveBeenCalledWith('valid-token')
        expect(authRepository.findById).toHaveBeenCalledWith(1)

        expect(req.user).toEqual({
            id: 1,
            fullName: 'TK',
            email: 'tk@gmail.com',
            role: 'admin',
            isActive: true,
        })

        expect(next).toHaveBeenCalledWith()
    })

    test('should return 401 when authorization header is missing', async () => {
        const req = {
            headers: {},
        }

        const next = jest.fn()

        await authenticate(req, res, next)

        expect(next).toHaveBeenCalledTimes(1)

        const error = next.mock.calls[0][0]

        expect(error.statusCode).toBe(401)
        expect(error.message).toBe('Authentication token is required.')

        expect(verifyToken).not.toHaveBeenCalled()
        expect(authRepository.findById).not.toHaveBeenCalled()
    })

    test('should return 401 when authorization header format is invalid', async () => {
        const req = {
            headers: {
                authorization: 'Basic valid-token',
            },
        }

        const next = jest.fn()

        await authenticate(req, res, next)

        expect(next).toHaveBeenCalledTimes(1)

        const error = next.mock.calls[0][0]

        expect(error.statusCode).toBe(401)
        expect(error.message).toBe('Invalid authentication token format.')

        expect(verifyToken).not.toHaveBeenCalled()
    })

    test('should return 401 when bearer token is missing', async () => {
        const req = {
            headers: {
                authorization: 'Bearer',
            },
        }

        const next = jest.fn()

        await authenticate(req, res, next)

        expect(next).toHaveBeenCalledTimes(1)

        const error = next.mock.calls[0][0]

        expect(error.statusCode).toBe(401)
        expect(error.message).toBe('Invalid authentication token format.')

        expect(verifyToken).not.toHaveBeenCalled()
    })

    test('should return 401 when JWT verification fails', async () => {
        const req = {
            headers: {
                authorization: 'Bearer invalid-token',
            },
        }

        const next = jest.fn()

        verifyToken.mockImplementation(() => {
            throw new Error('Invalid token')
        })

        await authenticate(req, res, next)

        expect(next).toHaveBeenCalledTimes(1)

        const error = next.mock.calls[0][0]

        expect(error.statusCode).toBe(401)
        expect(error.message).toBe('Invalid or expired authentication token.')

        expect(authRepository.findById).not.toHaveBeenCalled()
    })

    test('should return 401 when user does not exist', async () => {
        const req = {
            headers: {
                authorization: 'Bearer valid-token',
            },
        }

        const next = jest.fn()

        verifyToken.mockReturnValue({
            id: 999,
        })

        authRepository.findById.mockResolvedValue(null)

        await authenticate(req, res, next)

        expect(next).toHaveBeenCalledTimes(1)

        const error = next.mock.calls[0][0]

        expect(error.statusCode).toBe(401)
        expect(error.message).toBe('User associated with the token was not found.')
    })

    test('should return 403 when user is inactive', async () => {
        const req = {
            headers: {
                authorization: 'Bearer valid-token',
            },
        }

        const next = jest.fn()

        verifyToken.mockReturnValue({
            id: 1,
        })

        authRepository.findById.mockResolvedValue({
            id: 1,
            fullName: 'TK',
            email: 'tk@gmail.com',
            role: 'admin',
            isActive: false,
        })

        await authenticate(req, res, next)

        expect(next).toHaveBeenCalledTimes(1)

        const error = next.mock.calls[0][0]

        expect(error.statusCode).toBe(403)
        expect(error.message).toBe('Your account has been deactivated.')

        expect(req.user).toBeUndefined()
    })
})
