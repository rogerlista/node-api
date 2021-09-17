const { ServerError, UnauthorizedError } = require('./error')

module.exports = class HttpRequest {
  static badRequest(error) {
    return {
      statusCode: 400,
      body: {
        error: error.message,
      },
    }
  }

  static ok(data) {
    return {
      statusCode: 200,
      body: data,
    }
  }

  static serverError() {
    return {
      statusCode: 500,
      body: {
        error: new ServerError().message,
      },
    }
  }

  static unauthorizedError() {
    return {
      statusCode: 401,
      body: {
        error: new UnauthorizedError().message,
      },
    }
  }
}
