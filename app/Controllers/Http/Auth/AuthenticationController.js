'use strict'
const User = use('App/Models/User')
class Auth {

    async register ({ request, auth, response }) {
      const userData = request.only(['username', 'email', 'password'])

      try {
        const user = await User.create(userData)

        const token = await auth.generate(user)

        return response.json({
          status: 'success',
          data: token
        })
      } catch (error) {
        console.log(error)
        return response.status(400).json({
          status: 'error',
          message: 'There was a problem creating the user, please try again later.'
        })
      }
    }
    async login ({ request, response,auth}) {
        
        const { email, password } = request.only(['email', 'password'])
        console.log(email)
        try {
          const token = await auth.attempt(email, password)
    
          return response.json({
            status: 'success',
            data: token
          })
        } catch (error) {
          response.status(400).json({
            status: 'error',
            message: 'Invalid email/password.',
            detail:error.message
          })
        }
    }

    async me ({ auth, response }) {
        
        return response.json({
          status: 'success',
          data: auth.user
        })
      }
}

module.exports = Auth
