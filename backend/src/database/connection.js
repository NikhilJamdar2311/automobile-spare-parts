const { Sequelize } = require('sequelize')
const config = require('../config')
const logger = require('../common/logger')

const sequelize = new Sequelize(config.database.url, {
    dialect: config.database.dialect,
    logging: config.database.logging ? console.log : false,
})

async function connectDatabase() {
    try {
        await sequelize.authenticate()
        logger.info('Database connection established successfully.')

        await sequelize.sync({ alter: true })
        logger.info('Database synchronized successfully.')
    } catch (error) {
        logger.error('Unable to connect to the database.')
        logger.error(error)
        throw error
    }
}

module.exports = {
    sequelize,
    connectDatabase,
}
