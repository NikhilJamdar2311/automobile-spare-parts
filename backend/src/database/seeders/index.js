const logger = require('../../common/logger')
const { seedAdminUser } = require('./admin-user.seeder')

async function runSeeders() {
    logger.info('Running database seeders...')

    await seedAdminUser()

    logger.info('All seeders completed successfully.')
}

module.exports = {
    runSeeders,
}
