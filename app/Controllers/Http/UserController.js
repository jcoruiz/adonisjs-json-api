'use strict'
const User = use('App/Models/User')
class UserController {
    async register ({ view,request, auth ,response, session}) {
        const user = new User()
            
        user.username = request.input('username')
        user.email = request.input('email')
        user.password = request.input('password')
        
        
        try{
            await user.save();
            

        }
        catch(error)
        {
            resultado = 0;
        }
        


        
        response.json(user);
    }
}

module.exports = UserController
