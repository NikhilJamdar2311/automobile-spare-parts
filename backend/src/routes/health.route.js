const ApiResponse = require('../common/response/api-response')
const config = require('../config')
const express = require('express')
const { checkDatabaseHealth } = require('../database')
const router = express.Router()

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health Check
 *     description: Returns the health status of the application and database.
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: Application health status.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Health check successful.
 *                 data:
 *                   type: object
 *                   properties:
 *                     application:
 *                       type: string
 *                       example: UP
 *                     database:
 *                       type: string
 *                       example: UP
 *                     version:
 *                       type: string
 *                       example: 1.0.0
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-07-26T14:30:45.123Z"
 */

router.get('/', async (req, res) => {
    try {
        await checkDatabaseHealth()

        return ApiResponse.success(res, 'Health check successful.', {
            application: 'UP',
            database: 'UP',
            version: config.application.version,
            timestamp: new Date().toISOString(),
        })
    } catch {
        return res.status(200).json({
            success: false,
            message: 'Health check failed.',
            data: {
                application: 'UP',
                database: 'DOWN',
                version: config.application.version,
                timestamp: new Date().toISOString(),
            },
        })
    }
})

// router.get("/", (req, res) => {
//     throw new Error("Testing Global Error Handler");
// });

module.exports = router
