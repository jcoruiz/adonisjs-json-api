'use strict'

    const Database = use('Database')
    const data = use('App/Utils/Data')
    const ResponseBuilder = use('App/Utils/ResponseBuilder')
    const Logger = use('Logger')
    const TechnicalException = use('App/Exceptions/TechnicalException')
    const uuidv4 = require('uuid/v4')
    
    /**
     * Esta clase está encargada de administrar la tabla person
     * @name V1
     * @namespace person.Vfilter
     * @class
     * 
     */
    class Vfilter {

      /**
       * @version Vfilter       
       * @description
       * <b>Estados de resultado</b>
       * <table>
       *  <tr>
       *    <th>Estado</th>
       *    <th>Descripción</th>
       *  </tr>
       *  <tr>
       *    <td>201</td>
       *    <td>Created: se ha generado el recurso satisfactoriamente</td>
       *  </tr>
       *  <tr>
       *    <td>400</td>
       *    <td>Technical Exception: TODO</td>
       *  </tr>
       *  <tr>
       *    <td>401</td>
       *    <td>Authentication: Autenticación invalida</td>
       *  </tr>
       *  <tr>
       *    <td>403</td>
       *    <td>Forbidden: Sin acceso al recurso solicitado</td>
       *  </tr>
       *  <tr>
       *    <td>404</td>
       *    <td>Not Found: no se ha encontrado el recurso relacionado</td>
       *  </tr>
       *  <tr>
       *    <td>409</td>
       *    <td>Conflict: se ha generado un conflicto de ID en la generación de los recursos</td>
       *  </tr>
       * </table>
       * 
       * @example <caption>Request:</caption>
       * {@lang bash}
       * POST: {Protocol}://{Server}:{Port}/{Client}/{Version}/core/person
       * {
       *  "name": "name",
       *  "lastName": "lastName"
       * }
       * @example <caption>Response 201:</caption>
       * {@lang bash}
       * HEADER:
       *  Location: {protocol}://{server}:{port}/{client}/{version}/core/person/{id}
       * JSON:
       * {
       *    "data": [
		   *      {
			 *        "links": {
			 *          "self": "{protocol}://{server}:{port}/{client}/{version}/core/person/{id}"
			 *        }
	     *      }
	     *    ]
       * }
       * 
       * @function
       * @memberof person.Vfilter
       * 
      */
      async placeholder ({request, response, auth}) {
        try {
          

          return response.status(200).send('')

        } catch (e) {
          throw new TechnicalException()
        }
      }

    }
    
    module.exports = Vfilter