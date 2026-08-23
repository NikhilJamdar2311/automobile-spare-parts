class ApiResponse {
    static send(res, statusCode, success, message, data = null, errors = null) {
        return res.status(statusCode).json({
            success,
            message,
            data,
            errors,
        })
    }

    static success(res, message, data = null, statusCode = 200) {
        return this.send(res, statusCode, true, message, data)
    }

    static created(res, message, data = null) {
        return this.send(res, 201, true, message, data)
    }

    static noContent(res) {
        return res.status(204).send()
    }

    static error(res, statusCode, message, errors = null) {
        return this.send(res, statusCode, false, message, null, errors)
    }
}

module.exports = ApiResponse
