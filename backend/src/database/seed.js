const logger = require('../common/logger')
const database = require('./')
const { runSeeders } = require('./seeders')

async function seed() {
    try {
        await database.connectDatabase()

        await runSeeders()

        logger.info('Database seeding completed successfully.')

        await database.sequelize.close()

        process.exit(0)
    } catch (error) {
        logger.error('Database seeding failed.')
        logger.error(error)

        await database.sequelize.close()

        process.exit(1)
    }
}

seed()
