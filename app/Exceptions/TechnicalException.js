'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

class TechnicalException extends LogicalException {
  /**
   * Handle this exception by itself
   */
  handle (error, { response }) {
    console.log(error)
    return response.status(400).json({
      error: 'Technical Exception',
    });
  }
}

module.exports = TechnicalException
