const dotenv = require('dotenv')
const path = require('node:path')

dotenv.config({
    path: path.resolve(__dirname, '../../.env'),
})

function requireEnv(name) {
    const value = process.env[name]

    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`)
    }

    return value
}

const env = Object.freeze({
    nodeEnv: requireEnv('NODE_ENV'),
    host: requireEnv('HOST'),
    port: Number(requireEnv('PORT')),
    databaseUrl: requireEnv('DATABASE_URL'),
    logLevel: requireEnv('LOG_LEVEL'),
    adminName: requireEnv('ADMIN_NAME'),
    adminEmail: requireEnv('ADMIN_EMAIL'),
    adminPassword: requireEnv('ADMIN_PASSWORD'),
    jwtSecret: requireEnv('JWT_SECRET'),
    jwtExpiresIn: requireEnv('JWT_EXPIRES_IN'),
})

module.exports = env
