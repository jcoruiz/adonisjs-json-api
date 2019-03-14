'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
const AuthorizationException = use('App/Exceptions/AuthorizationException');

class Authorization {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ request }, next) {

    if("challenge" != "challenge")
    {
      throw new AuthorizationException();
    }
    
    // call next to advance the request
    await next()
  }
}

module.exports = Authorization
