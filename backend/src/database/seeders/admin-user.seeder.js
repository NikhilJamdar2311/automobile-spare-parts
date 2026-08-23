const config = require('../../config')
const logger = require('../../common/logger')
const { hashPassword } = require('../../common/helpers/password.helper')
const User = require('../models/user.model')

async function seedAdminUser() {
    try {
        // Check if admin already exists
        const existingAdmin = await User.findOne({
            where: {
                email: config.env.adminEmail,
            },
        })

        if (existingAdmin) {
            logger.info('Default admin user already exists.')
            return
        }

        // Hash password
        const hashedPassword = await hashPassword(config.env.adminPassword)

        // Create admin user
        await User.create({
            fullName: config.env.adminName,
            email: config.env.adminEmail,
            password: hashedPassword,
            role: 'admin',
            isActive: true,
        })

        logger.info('Default admin user created successfully.')
    } catch (error) {
        logger.error('Failed to seed default admin user.')
        throw error
    }
}

module.exports = {
    seedAdminUser,
}
