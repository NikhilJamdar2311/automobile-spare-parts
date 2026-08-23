const authorizeRoles = require('../../src/common/middleware/authorize.middleware')

describe('authorizeRoles middleware', () => {
    function createResponse() {
        return {}
    }

    test('should call next when user has an allowed role', () => {
        const req = {
            user: {
                id: 1,
                role: 'admin',
            },
        }

        const res = createResponse()
        const next = jest.fn()

        const middleware = authorizeRoles('admin')

        middleware(req, res, next)

        expect(next).toHaveBeenCalledWith()
    })

    test('should call next with 403 ApiError when user role is not allowed', () => {
        const req = {
            user: {
                id: 1,
                role: 'employee',
            },
        }

        const res = createResponse()
        const next = jest.fn()

        const middleware = authorizeRoles('admin')

        middleware(req, res, next)

        expect(next).toHaveBeenCalledTimes(1)

        const error = next.mock.calls[0][0]

        expect(error.statusCode).toBe(403)
        expect(error.message).toBe('You do not have permission to perform this action.')
    })

    test('should call next with 401 ApiError when user is missing', () => {
        const req = {}
        const res = createResponse()
        const next = jest.fn()

        const middleware = authorizeRoles('admin')

        middleware(req, res, next)

        expect(next).toHaveBeenCalledTimes(1)

        const error = next.mock.calls[0][0]

        expect(error.statusCode).toBe(401)
        expect(error.message).toBe('Authentication is required.')
    })

    test('should allow multiple roles', () => {
        const req = {
            user: {
                id: 1,
                role: 'manager',
            },
        }

        const res = createResponse()
        const next = jest.fn()

        const middleware = authorizeRoles('admin', 'manager')

        middleware(req, res, next)

        expect(next).toHaveBeenCalledWith()
    })
})
