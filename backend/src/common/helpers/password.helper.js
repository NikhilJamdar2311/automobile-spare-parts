const bcrypt = require('bcrypt')

const SaltRounds = 10

async function hashPassword(password) {
    const hashedPassword = await bcrypt.hash(password, SaltRounds)
    return hashedPassword
}

async function comparePaasword(plainPassword, hashedPaasword) {
    const isMatch = await bcrypt.compare(plainPassword, hashedPaasword)
    return isMatch
}

module.exports = {
    hashPassword,
    comparePaasword,
}
