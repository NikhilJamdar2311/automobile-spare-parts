jest.mock('../../src/modules/auth/auth.repository', () => ({
    findByEmail: jest.fn(),
    findById: jest.fn(),
}))

const request = require('supertest')
const bcrypt = require('bcrypt')

const app = require('../../src/app')
const authRepository = require('../../src/modules/auth/auth.repository')

describe('Authentication API', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('POST /api/auth/login', () => {
        test('should login successfully with valid credentials', async () => {
            const password = 'Admin@123'
            const hashedPassword = await bcrypt.hash(password, 10)

            authRepository.findByEmail.mockResolvedValue({
                id: 1,
                fullName: 'TK',
                email: 'tk@gmail.com',
                password: hashedPassword,
                role: 'admin',
                isActive: true,
            })

            const response = await request(app).post('/api/auth/login').send({
                email: 'tk@gmail.com',
                password,
            })

            expect(response.statusCode).toBe(200)

            expect(response.body.success).toBe(true)
            expect(response.body.message).toBe('Login successful.')

            expect(response.body.data.user).toEqual({
                id: 1,
                fullName: 'TK',
                email: 'tk@gmail.com',
                role: 'admin',
            })

            expect(response.body.data.token).toBeDefined()
            expect(typeof response.body.data.token).toBe('string')

            expect(authRepository.findByEmail).toHaveBeenCalledWith('tk@gmail.com')
        })

        test('should return 401 for invalid email', async () => {
            authRepository.findByEmail.mockResolvedValue(null)

            const response = await request(app).post('/api/auth/login').send({
                email: 'unknown@gmail.com',
                password: 'Admin@123',
            })

            expect(response.statusCode).toBe(401)

            expect(response.body.success).toBe(false)
            expect(response.body.message).toBe('Invalid email or password.')
        })

        test('should return 401 for invalid password', async () => {
            const hashedPassword = await bcrypt.hash('CorrectPassword@123', 10)

            authRepository.findByEmail.mockResolvedValue({
                id: 1,
                fullName: 'TK',
                email: 'tk@gmail.com',
                password: hashedPassword,
                role: 'admin',
                isActive: true,
            })

            const response = await request(app).post('/api/auth/login').send({
                email: 'tk@gmail.com',
                password: 'WrongPassword@123',
            })

            expect(response.statusCode).toBe(401)

            expect(response.body.success).toBe(false)
            expect(response.body.message).toBe('Invalid email or password.')
        })

        test('should return 403 for inactive user', async () => {
            authRepository.findByEmail.mockResolvedValue({
                id: 1,
                fullName: 'TK',
                email: 'tk@gmail.com',
                password: await bcrypt.hash('Admin@123', 10),
                role: 'admin',
                isActive: false,
            })

            const response = await request(app).post('/api/auth/login').send({
                email: 'tk@gmail.com',
                password: 'Admin@123',
            })

            expect(response.statusCode).toBe(403)

            expect(response.body.success).toBe(false)
            expect(response.body.message).toBe('Your account has been deactivated.')
        })
    })
})
