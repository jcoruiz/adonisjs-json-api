'use strict'
/**
 * Esta clase está encargada de administrar personas
 * @name PersonaController
 * @class
 * 
 */
class PersonaController {
    /**
     * @version 1.0.0
     * @description
     * Entrega lista de personas
     * @example
     * {@lang bash}
     * curl -i -H "Accept: application/json" "localhost:3334/Talento/Talento/organigrama" -d "param=value"
     * @example
     * response
     * {@lang json}
     * [
     * {}
     *   ]
     * 
     * @function
     * @return {Array<Persona>} respuesta
    */
    async list({request,response,auth}){
        try {
            var aa = await auth.check();
            console.log(aa)
          } catch (error) {
              
            response.send('Missing or invalid jwt token')
          }
    }
}

module.exports = PersonaController
