const path = require('node:path')

module.exports = {
    '*.{js,jsx}': (files) => {
        const frontendFiles = files.filter((file) => file.startsWith('frontend/'))

        const backendFiles = files.filter((file) => file.startsWith('backend/'))

        const commands = []

        if (frontendFiles.length) {
            commands.push(`prettier --write ${frontendFiles.join(' ')}`)

            commands.push(`npm run lint:frontend -- --fix ${frontendFiles.join(' ')}`)
        }

        if (backendFiles.length) {
            commands.push(`prettier --write ${backendFiles.join(' ')}`)

            commands.push(`npm run lint:backend -- --fix ${backendFiles.join(' ')}`)
        }

        return commands
    },

    '*.{json,md,yml,yaml}': ['prettier --write'],
}
