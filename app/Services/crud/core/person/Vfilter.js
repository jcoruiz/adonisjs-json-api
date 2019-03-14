'use strict'

    const Database = use('Database')
    const data = use('App/Utils/Data')
    const ResponseBuilder = use('App/Utils/ResponseBuilder')
    const Logger = use('Logger')
    const TechnicalException = use('App/Exceptions/TechnicalException')
    const uuidv4 = use('uuid/v4')
    const validateJson = use('App/Utils/ValidateJson')
    const Sorting = use('App/Utils/Sorting')
    const Pagination = use('App/Utils/Pagination')
    
    /**
     * Esta clase está encargada de administrar la tabla person
     * @extends VfilterCrud
     * @namespace person.VfilterCrud
     * @class
     * 
     */
    class Vfilter {
      tableSchema () {
        return {"tableName":"core_person","fields":[{"fieldName":"id"},{"fieldName":"identification"},{"fieldName":"names"},{"fieldName":"lastName"},{"fieldName":"mothersName"},{"fieldName":"email"},{"fieldName":"birthDate"},{"fieldName":"core_genderId"},{"fieldName":"picture"},{"fieldName":"dt_cre"},{"fieldName":"dt_mod"},{"fieldName":"deleted"},{"fieldName":"active"}],"columns":["id","identification","names","lastName","mothersName","email","birthDate","core_genderId","picture","dt_cre","dt_mod","deleted","active"]}
      }

      /**
       * @version Vfilter
       * @author Jonathan (Johnny) Olivares
       * @description
       * Create an Entity in the table person
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
       * @version Vfilter
       * @description
       * Update an Entity in the table person
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
       * PATCH {Protocol}://{Server}:{Port}/{Client}/{Version}/core/person/{id}
       * {
       *    "data" : {
       *      "type": "core_person",
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
       * @memberof person.Vfilter
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
       * @version Vfilter
       * @description
       * Delete Entity (Logical) in the table person
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
       * DELETE {Protocol}://{Server}:{Port}/{Client}/{Version}/core/person/{id}
       * 
       * @example <caption>Response 204:</caption>
       * {@lang json}
       * NO-CONTENT
       * @function
       * @memberof person.Vfilter
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
       * @version Vfilter
       * @description
       * Search in the table core_person
       * 
       * 
       * <h3>Opcion filter</h3>
       * 
       * Existen 2 formas de filtrar el resultado de la api, "incremental" y "direct"
       * 
       * <h4>Incremental</h4>
       * 
       * Esta opción permite realizar busqueda de cadenas en multiples culumnas, ideal para busqueda de tablas.
       * <br>La estructura es la siguiente:
       * 
       * ```javascript
       * "filter": {
       *   "type": "incremental",
       *   "search": "",
       *   "in": ["field1", "field2", "fieldN"]
       *  }
       * ```
       * 
       * El atributo `search` es la cadena de texto que se quiere buscar, este aguanta varias palabras separadas por espacio.<br>
       * La busqueda se realiza sobre los campos especificados en el atribute `in`, la busqueda devolvera los registros que contengan todos las palabras del atributo `search` en alguno de los campos.
       * 
       * <b>Ejemplo:</b>
       * 
       * Con la siguiente tabla
       * 
       * | id | names | lastName | email |
       * | ------ | ------ | ------ | ------ |
       * | 1 | Homero Jay | Simpson | amantedelacomida53@aol.com |
       * | 2 | Bartolomeo Jay | Simpson | elbarto@gmail.com |
       * | 3 | Lisa Marie | Simpson | liiiiisaaaa@gmail.com |
       * 
       * Y con el siguiente request :
       * ```javascript
       * "filter": {
       *   "type": "incremental",
       *   "search": "simp",
       *   "in": ["names", "lastName", "email"]
       *  }
       * ```
       * el metodo devolvera los registros que contienen <b>simp</b> en alguno de los campos
       * 
       * | id | names | lastName | email |
       * | ------ | ------ | ------ | ------ |
       * | 1 | Homero Jay | <b>Simp</b>son | amantedelacomida53@aol.com |
       * | 2 | Bartolomeo Jay | <b>Simp</b>son | elbarto@gmail.com |
       * | 3 | Lisa Marie | <b>Simp</b>son | liiiiisaaaa@aol.com |
       * 
       * Mientras que la siguiente petición:
       * 
       * ```javascript
       * "filter": {
       *   "type": "incremental",
       *   "search": "jay aol",
       *   "in": ["names", "lastName", "email"]
       *  }
       * ```
       * 
       * Solo devolvera los registros que tengan <b>jay</b> y <b>aol</b> en alguno de los campos:
       * 
       * | id | names | lastName | email |
       * | ------ | ------ | ------ | ------ |
       * | 1 | Homero <b>Jay</b> | Simpson | amantedelacomida53@<b>aol</b>.com |
       * 
       * <h4>direct</h4>
       * 
       * El tipo de busqueda direct es la manera tradicional de realizar busqueda por campos especificos, la forma de configurar esta opción es la siguiente:
       * ```javascript
       * "filter": {
       *   "type": "direct",
       *   "sentences": [
       *   {
       *     "operator": "and",
       *     "fields":{
       *       "names": {
       *         "eq": "Homero"
       *       },
       *       "birthDate": {
       *         "ge": "1990-01-01",
       *         "le": "1990-12-31"
       *       }
       *     }
       *   }]
       * }
       * ```
       * | Operador | Equivalente | Ejemplo | Resultado |
       * | ------ | ------ | ------ | ------ |
       * | eq | = | "names": { "eq": "Johnny" } | names = 'Johnny' |
       * | ne | != | "names": { "ne": "Johnny" } | names != 'Johnny' |
       * | gt | > | "dt_cre": { "gt": "2018-01-30" } | dt_cre > '2018-01-01' |
       * | lt | < | "order": { "lt": 4} | order < 4 |
       * | ge | >= | "order": { "ge": 1} | order >= 1 |
       * | lt | <= | "dt_cre": { "lt": "2017-05-18" } | dt_cre <= '2017-05-18' |
       * | in | in | "code": { "in": ["code001", "code002"] } | code in('code001', 'code002') |
       * | ni | not in | "type": { "ni": ["type1", "type2"] } | type not in('type1', 'type2') |
       * | nn | not null | "result": { "nn": ""} | result not null |
       * | n | null | "core_genderId": { "n": "" } | core_genderId is null |  
       * | lk | like | "lastName": { "lk": "naha" } | lastName like '%naha%' |     
       * @example <caption>Request:</caption>
       * {@lang bash}
       * POST: {Protocol}://{Server}:{Port}/{Client}/vfilter/core/person/
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
       * @memberof person.Vfilter
       * 
      */
      async readAll ({request, response, auth}) {
        try{
          const page = validateJson.validate(request.input('page'))
          const sort = request.input('sort')
          const filter = validateJson.validate(request.input('filter'))
          
          //console.log(filter)

          const pagination = true

          //Get Sort String with validation of field only when var sort length is greather than 0
          const sortString = (sort.length == 0) ? '' : Sorting.make(sort, this.tableSchema())

          const coneccion = await data.getConeccionCliente("")
          Database.Config._config.database.default=coneccion

          //console.log(Database.select('*').from('users').where('id', 1).toString())

          //Select
          var qr = Database.table(this.tableSchema().tableName)

          

          //Filter
          qr = qr.where('deleted', 0)

          //Filter Incremental
          if(filter.type == 'incremental'){
            const searchSplit = filter.search.split(' ')
            searchSplit.forEach(function(search){
              qr.where(function(){
                const obj = this
                filter.in.forEach(function(field){
                  obj.orWhere(field, 'like', `%${search}%`)
                })
              })
            })
          }

          //Filter Direct
          if(filter.type == 'direct'){
            filter.sentences.forEach(function(sentence) {

              qr.where(function(){
                var whereObj = this
                const operator = sentence.operator
                const fields = sentence.fields

                for (const field in fields){
                  let value = fields[field]

                  const type = Object.prototype.toString.call(value)

                  switch(type){

                    case '[object String]':
                      if(operator == 'and'){
                        whereObj.andWhere(field, value)
                      } else if(operator == 'or'){
                        whereObj.orWhere(field, value)
                      }
                    break

                    case '[object Array]':
                      if(operator == 'and'){
                        whereObj.whereIn(field, value)
                      } else if(operator == 'or'){
                        whereObj.orWhereIn(field, value)
                      }
                    break

                    case '[object Object]':

                      for (const comparison in value){
                        let search = value[comparison]

                        switch(comparison){
                          case 'eq':
                            if(operator == 'and'){
                              whereObj.andWhere(field, search)
                            } else if(operator == 'or'){
                              whereObj.orWhere(field, search)
                            }
                          break

                          case 'ne':
                            if(operator == 'and'){
                              whereObj.whereNot(field, search)
                            } else if(operator == 'or'){
                              whereObj.orWhereNot(field, search)
                            }
                          break

                          case 'gt':
                            if(operator == 'and'){
                              whereObj.where(field, '>', search)
                            } else if(operator == 'or'){
                              whereObj.orWhere(field, '>', search)
                            }
                          break

                          case 'lt':
                            if(operator == 'and'){
                              whereObj.where(field, '<', search)
                            } else if(operator == 'or'){
                              whereObj.orWhere(field, '<', search)
                            }
                          break

                          case 'ge':
                            if(operator == 'and'){
                              whereObj.where(field, '>=', search)
                            } else if(operator == 'or'){
                              whereObj.orWhere(field, '>=', search)
                            }
                          break

                          case 'le':
                            if(operator == 'and'){
                              whereObj.where(field, '<=', search)
                            } else if(operator == 'or'){
                              whereObj.orWhere(field, '<=', search)
                            }
                          break

                          case 'in':
                            if(operator == 'and'){
                              whereObj.whereIn(field, search)
                            } else if(operator == 'or'){
                              whereObj.orWhereIn(field, search)
                            }
                          break

                          case 'ni':
                            if(operator == 'and'){
                              whereObj.whereNotIn(field, search)
                            } else if(operator == 'or'){
                              whereObj.orWhereNotIn(field, search)
                            }
                          break

                          case 'n':
                            if(operator == 'and'){
                              whereObj.whereNull(field)
                            } else if(operator == 'or'){
                              whereObj.orWhereNull(field)
                            }
                          break

                          case 'nn':
                            if(operator == 'and'){
                              whereObj.whereNotNull(field)
                            } else if(operator == 'or'){
                              whereObj.orWhereNotNull(field)
                            }
                          break
                        }
                      }
                      
                    break
                  }
                }
              })
                
              
            })
          }

          //Sorting only when sortString length is greather than 0
          qr = (sortString.length == 0) ? qr : qr.orderByRaw(sortString)
           
          //Pagination COUNT
          var qrCount = qr.clone()
          var qrCount = await qrCount.count('* as count')
          var count = qrCount[0].count

          qr = qr.column(this.tableSchema().columns).select()

          //Pagination
          qr = qr.forPage(page.number,page.size)
          //qr = qr.paginate(page.number,page.size)

          var objResponse = {}

          console.log(qr.toString())
             
          qr = await qr  
          
          objResponse.data = qr //qr.data when include is functional and nest table

          objResponse = Pagination.make(request, count, objResponse)

          return  objResponse//ResponseBuilder.create(request, qr, pagination, count)

        } catch (e) {
          console.log(e)
          throw new TechnicalException()
        }
      }

      /**
       * @version Vfilter
       * @description
       * Read an Entity in the table person
       * @example <caption>Request:</caption>
       * {@lang bash}
       * POST: {Protocol}://{Server}:{Port}/{Client}/{Version}/core/person/{id}
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
    
    module.exports = Vfilter