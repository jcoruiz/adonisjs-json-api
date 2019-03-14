'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

class AuthenticationException extends LogicalException {
  /**
   * Handle this exception by itself
   */
  handle (error, { response }) {
    return response.status(401).json({
      error: 'Missing or invalid credential',
    });
  }
}

module.exports = AuthenticationException
