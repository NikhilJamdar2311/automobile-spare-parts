const { sequelize, connectDatabase } = require('./connection')

// Register all models
require('./models')

async function checkDatabaseHealth() {
    await sequelize.authenticate()
}

module.exports = Object.freeze({
    sequelize,
    connectDatabase,
    checkDatabaseHealth,
})
