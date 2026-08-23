const User = require('../../database/models/user.model')

async function findByEmail(email) {
    return User.findOne({
        where: {
            email,
        },
    })
}

async function findById(id) {
    return User.findByPk(id)
}

module.exports = {
    findByEmail,
    findById,
}
