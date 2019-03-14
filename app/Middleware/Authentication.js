'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
const AuthenticationException = use('App/Exceptions/AuthenticationException');

class Authentication {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ request, auth }, next) {
    
    try {
      //var checkAuthentication = await auth.check();
    } catch (error) {
      throw new AuthenticationException();
    }
    
    // call next to advance the request
    await next()
  }
}

module.exports = Authentication
