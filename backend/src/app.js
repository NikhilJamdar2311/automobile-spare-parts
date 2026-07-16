const notFound = require('./common/middleware/not-found.middleware')
const errorHandler = require('./common/middleware/error-handler')
const swaggerUi = require('swagger-ui-express')
const swaggerSpec = require('./config/swagger')

const routes = require('./routes')
const config = require('./config')

const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const morgan = require('morgan')

const app = express()

app.use(helmet())
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

app.use(express.urlencoded({ extended: true }))

app.use(config.application.apiPrefix, routes)
app.use(config.application.docsPrefix, swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use(notFound)
app.use(errorHandler)

module.exports = app
