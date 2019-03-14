'use strict'

    const Database = use('Database')
    const data = use('App/Utils/Data')
    const ResponseBuilder = use('App/Utils/ResponseBuilder')
    const roleBase = use('App/Services/core/role/')
    const Logger = use('Logger')
    const TechnicalException = use('App/Exceptions/TechnicalException')
    const uuidv4 = use('uuid/v4')
    const validateJson = use('App/Utils/ValidateJson')
    
    /**
     * Esta clase está encargada de administrar la tabla role
     * @name V1
     * @namespace role.V1
     * @class
     * 
     */
    class V1 extends roleBase {
      tableSchema () {
        return {"tableName":"core_role","fields":[{"fieldName":"id"},{"fieldName":"name"},{"fieldName":"dt_cre"},{"fieldName":"dt_mod"},{"fieldName":"deleted"},{"fieldName":"active"}],"columns":["id","name","dt_cre","dt_mod","deleted","active"]}
      }

      /**
       * @version V1
       * @author Jonathan (Johnny) Olivares
       * @description
       * Create an Entity in the table role
       * 
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
       * POST: {Protocol}://{Server}:{Port}/{Client}/{Version}/core/role
       * {
       *  "name": "name",
       *  "lastName": "lastName"
       * }
       * @example <caption>Response 201:</caption>
       * {@lang bash}
       * HEADER:
       *  Location: {protocol}://{server}:{port}/{client}/{version}/core/role/{id}
       * JSON:
       * {
       *    "data": [
		   *      {
			 *        "links": {
			 *          "self": "{protocol}://{server}:{port}/{client}/{version}/core/role/{id}"
			 *        }
	     *      }
	     *    ]
       * }
       * 
       * @function
       * @memberof role.V1
       * 
      */
      async create ({request, response, auth}) {
        try {
          const obj = request.all()
          const pagination = false

          const coneccion = await data.getConeccionCliente("")
          Database.Config._config.database.default=coneccion
          
          var objInsert = {}
          const id = uuidv4()

          this.tableSchema().fields.forEach(field => {
            var value = null

            value = (field.fieldName == 'id') ? id : value  //Default value for Column id
            value = (field.fieldName == 'active') ? 1 : value //Default value for Column active
            value = (field.fieldName == 'deleted') ? 0 : value //Default value for Column deleted
            value = (field.fieldName == 'dt_cre' || field.fieldName == 'dt_mod') ? new Date() : value //Default value for Column dt_cre/dt_mod
            value = (obj[field.fieldName] == null) ? value : obj[field.fieldName]

            objInsert[field.fieldName] = value

          })

          var qr = Database.table(this.tableSchema().tableName).insert(objInsert)
          qr = await qr

          const url = `${request.protocol()}://${request.header('host')}`
          const location = encodeURI(`${url}${request.url()}/${id}`)

          var objR = {
            data:[{
              links: {
                self: location
              }
            }]
          }

          response.header('Location', location)
          return response.status(201).send(objR)

        } catch (e) {
          throw new TechnicalException()
        }
      }

      /**
       * @version V1
       * @description
       * Update an Entity in the table role
       * <b>Estados de resultado</b>
       * <table>
       *  <tr>
       *    <th>Estado</th>
       *    <th>Descripción</th>
       *  </tr>
       *  <tr>
       *    <td>200</td>
       *    <td>OK: Se ha actualizado el recurso satisfactoriamente</td>
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
       *    <td>Not Found: No se ha encontrado el recurso relacionado</td>
       *  </tr>
       *  <tr>
       *    <td>409</td>
       *    <td>Conflict: Se ha generado un conflicto de ID en la generación de los recursos</td>
       *  </tr>
       * </table>
       * 
       * 
       * @example <caption>Request:</caption>
       * {@lang bash}
       * PATCH {Protocol}://{Server}:{Port}/{Client}/{Version}/core/role/{id}
       * {
       *    "data" : {
       *      "type": "core_role",
       *      "id": "{id}",
       *      "attributes": {
       *        "name": "name",
       *        "lastName": "lastName"
       *      }  
       *    }
       * }
       * @example <caption>Response:</caption>
       * {@lang bash}
       * JSON:
       * {
       *    "implementarObjeto": 0
       * }
       * 
       * @function
       * @memberof role.V1
       * 
      */
      async update ({request, response, auth}) {
        try{
         
          const id = request.params.id
          const fieldUpdate = request.all().data.attributes

          var qr = Database.table(this.tableSchema().tableName)
            .where({id:id})
            .update(fieldUpdate)
          
          qr = await qr
          
          return response.status(200).send({implementarobjeto: 0})

        } catch (e) {
          throw new TechnicalException()
        }
      }

      /**
       * @version V1
       * @description
       * Delete Entity (Logical) in the table role
       * 
       * <b>Estados de resultado</b>
       * <table>
       *  <tr>
       *    <th>Estado</th>
       *    <th>Descripción</th>
       *  </tr>
       *  <tr>
       *    <td>204</td>
       *    <td>No Content: se ha eliminado el recurso satisfactoriamente</td>
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
       *    <td>Conflict: se ha generado un conflicto de ID en la eliminacion de los recursos</td>
       *  </tr>
       * </table>
       * 
       * @example <caption>Request:</caption>
       * {@lang bash}
       * DELETE {Protocol}://{Server}:{Port}/{Client}/{Version}/core/role/{id}
       * 
       * @example <caption>Response 204:</caption>
       * {@lang json}
       * NO-CONTENT
       * @function
       * @memberof role.V1
       * 
      */
      async delete ({request, response, auth}) {
        try{
          const id = request.params.id

          var qr = Database.table(this.tableSchema().tableName)
            .where({id:id})
            .update({active: 0})
          
          qr = await qr
          
          return response.status(204).send()

        } catch (e) {
          console.log(e)
          throw new TechnicalException()
        }
      }

      /**
       * @version V1
       * @description
       * Create an Entity in the table role
       * @example <caption>Request:</caption>
       * {@lang bash}
       * POST: {Protocol}://{Server}:{Port}/{Client}/{Version}/core/role/
       * {
       *    "page":{
		   *      "number":"",
		   *      "size": ""
	     *    },
	     *    "sort": ""
       * }
       * 
       * @example <caption>Response:</caption>
       * {@lang json}
       * 
       * @function
       * @memberof role.V1
       * 
      */
      async readAll ({request, response, auth}) {
        try{
          const page = validateJson.validate(request.input('page'))
          const sort = validateJson.validate(request.input('sort'))
          const filter = validateJson.validate(request.input('filter'))
          
          const pagination = true

          //Get Sort String with validation of field only when var sort length is greather than 0
          const sortString = (sort.length == 0) ? '' : Sorting.make(sort, this.tableSchema())

          const coneccion = await data.getConeccionCliente("")
          Database.Config._config.database.default=coneccion

          //Select
          var qr = Database.table(this.tableSchema().tableName).column(this.tableSchema().columns).select()

          //Sorting only when sortString length is greather than 0
          qr = (sortString.length == 0) ? qr : qr.orderByRaw(sortString)

          //Pagination
          qr = qr.paginate(page.number,page.size)

          //Filtering TODO
              
          qr = await qr                      

          return ResponseBuilder.create(request, qr, pagination)

        } catch (e) {
          console.log(e)
          throw new TechnicalException()
        }
      }

      /**
       * @version V1
       * @description
       * Read an Entity in the table role
       * @example <caption>Request:</caption>
       * {@lang bash}
       * POST: {Protocol}://{Server}:{Port}/{Client}/{Version}/core/role/{id}
       * 
       * @example <caption>Response:</caption>
       * {@lang json}
       * [
       * {}
       *   ]
       * 
       * @function
       * @memberof Persona.V1
       * 
      */
      async read ({request, response, auth}) {
        const id = request.params.id

        try {
          const coneccion = await data.getConeccionCliente("")
          Database.Config._config.database.default=coneccion
          
          //Select
          var qr = Database.table(this.tableSchema().tableName).select(this.tableSchema().columns)

          //Filtering
          qr.where('id', id)
          qr = await qr 
          
          var obj = {data: qr}
          

          return obj
          //ResponseBuilder.create(request, qr, pagination)

        } catch (e) {
          console.log(e)
          throw new TechnicalException()
        }
      }


    }
    
    module.exports = V1