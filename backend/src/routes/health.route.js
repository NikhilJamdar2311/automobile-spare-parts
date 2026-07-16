const ApiResponse = require('../core/api-response')
const config = require('../config')
const express = require('express')

const router = express.Router()

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health Check
 *     description: Returns the health status of the application.
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: Application is running successfully.
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
 *                     status:
 *                       type: string
 *                       example: UP
 *                     version:
 *                       type: string
 *                       example: 1.0.0
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 */
router.get('/', (req, res) => {
    return ApiResponse.success(res, 'Health check successful.', {
        status: 'UP',
        version: config.application.version,
        timestamp: new Date().toISOString(),
    })
})

// router.get("/", (req, res) => {
//     throw new Error("Testing Global Error Handler");
// });

module.exports = router
