const swaggerJsdoc = require('swagger-jsdoc')
const config = require('./index')

const options = {
    definition: {
        openapi: '3.0.3',
        info: {
            title: config.application.name,
            version: config.application.version,
            description: 'API documentation for the Automobile Spare Parts Management System',
        },
        servers: [
            {
                url: `http://${config.server.host}:${config.server.port}${config.application.apiPrefix}`,
                description: 'Development Server',
            },
        ],
    },

    apis: ['./src/routes/*.js'],
}

const swaggerSpec = swaggerJsdoc(options)

module.exports = swaggerSpec
