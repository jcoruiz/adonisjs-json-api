'use strict'

    const Database = use('Database')
    const data = use('App/Utils/Data')
    const ResponseBuilder = use('App/Utils/ResponseBuilder')
    const personBase = use('App/Services/core/person/')
    const Logger = use('Logger')
    const TechnicalException = use('App/Exceptions/TechnicalException')
    const uuidv4 = require('uuid/v4')
    const Enumerable = require('linq')
    const lodash = require('lodash');
    
    /**
     * Esta clase está encargada de administrar la tabla person
     * @name V1
     * @namespace person.Vtest
     * @class
     *  
     */
    class Vtest extends personBase {
      tableSchema () {
        return {"tableName":"core_person","fields":[{"fieldName":"id"},{"fieldName":"identification"},{"fieldName":"names"},{"fieldName":"lastName"},{"fieldName":"mothersName"},{"fieldName":"email"},{"fieldName":"birthDate"},{"fieldName":"core_genderId"},{"fieldName":"picture"},{"fieldName":"dt_cre"},{"fieldName":"dt_mod"},{"fieldName":"deleted"},{"fieldName":"active"}],"columns":["id","identification","names","lastName","mothersName","email","birthDate","core_genderId","picture","dt_cre","dt_mod","deleted","active"]}
      }

      /**
       * @version Vtest
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
       * @memberof person.Vtest
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
       * @version Vtest
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
       * @memberof person.Vtest
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
       * @version Vtest
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
       * @memberof person.Vtest
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
       * @version Vtest
       * @description
       * Create an Entity in the table person
       * @example <caption>Request:</caption>
       * {@lang bash}
       * POST: {Protocol}://{Server}:{Port}/{Client}/{Version}/core/person/
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
       * @memberof person.Vtest
       * 
      */
      async readAll ({request, response, auth}) {

        const tableName = this.tableSchema().tableName

        try{
          const page = (request.input("page") == null) ? '' : request.input("page")
          const sort = (request.input("sort") == null) ? '' : request.input("sort")
          const include = (request.input("include") == null) ? '' : request.input("include")
          const filter = request.input("filter")
          const pagination = true

          
          const includeTable = include == '' ? 0 : include.split(',')
          //console.log(includeTable)

          //console.log(includeTable.length)

          //Get Sort String with validation of field only when var sort length is greather than 0
          const sortString = (sort.length == 0) ? '' : Sorting.make(sort, this.tableSchema())

          const coneccion = await data.getConeccionCliente("")
          Database.Config._config.database.default=coneccion

          const columnInfo = await Database.table(tableName).columnInfo()
          var foreignTable = []
          var tablesWithJoin = []

          /*
          var includeSchemaTables = []
          includeTable.forEach(function(include) {
            let tables = include.split('.');
              tables.forEach(function(table) {
                const dfs = await Database.table(tableName).columnInfo()
              })
            
          })*/

          
          

          for(var column in columnInfo){
            if(
              column == 'id' ||
              column == 'dt_cre' ||
              column == 'dt_mod' ||
              column == 'deleted' ||
              column == 'active'
            ){

            } else{
              //console.log(column) 
              const tableSplit = column.split('_')
              if(tableSplit.length > 1){
                var nameSplit =  column.split(/(?=[A-Z])/)
                if( (nameSplit[ (nameSplit.length == 0) ? 0 : nameSplit.length - 1]) == 'Id'){
                  foreignTable.push(column.slice(0,-2))
                }
              }
            }
          }



          //Select
          var qr = Database.table(tableName)//.column("Persona.id", "AcreditacionPersona.estado").select()//.column("Persona.id").select()

          //Sorting only when sortString length is greather than 0
          qr = (sortString.length == 0) ? qr : qr.orderByRaw(sortString)

          //Include Default
          foreignTable.forEach(function(table) {
            qr.leftJoin(table, `${tableName}.${table}Id`, `${table}.id`)
            tablesWithJoin.push(table)
          })

          //Include Custom
          if (includeTable.length > 0){

            for (const include of includeTable) {//includeTable.forEach(function(include) {
              let tables = include.split('.')
              var actualTable = tableName

              for (const table of tables) {
                var isWithJoin = (tablesWithJoin.indexOf(table) > -1)
                if(isWithJoin == false){

                  const schema = await Database.table(table).columnInfo()
                  var isReferenced = false
                  for(var column in schema){
                    if(column == `${actualTable}Id`){
                      isReferenced = true
                    }
                  }

                  if(isReferenced){
                    qr.leftJoin(table, `${actualTable}.id`, `${table}.${actualTable}Id`);
                  } else {
                    qr.leftJoin(table, `${actualTable}.${table}Id`, `${table}.id`);
                  }
                  
                  actualTable = table;
                }
              }
/*
              tables.forEach(function(table) {
                
                
              })
              */
              //qr.leftJoin(table, `${tableName}.${table}Id`, `${table}.id`)
            }
          }
          

          //qr.leftJoin("core_personUser", "core_person.id", "core_personUser.core_personId")

          //Pagination COUNT
          var qr2 = qr.clone()
          var qr2 = await qr2.count('* as count')
          var pag = qr2[0].count

          qr = qr.options({ nestTables: true})

          //Pagination
          qr = qr.forPage(page.number,page.size)
          //qr = qr.paginate(page.number,page.size)

          //Filtering TODO
              
          qr = await qr

        //console.log(qr)

        var lin = Enumerable.from(qr)
            .distinct(`$.${tableName}.id`)
            .select(function(obj){
              var linObj = {}
              linObj = obj[tableName]
              linObj._include = {}

              foreignTable.forEach(function(table) {
                linObj._include[table] = Enumerable.from(qr).where(`$.${tableName}.id == "${obj[tableName].id}" && $.${table}.id != null`).distinct(`$.${table}.id`).select(function(obj2){
                 return obj2[table]
                }).toArray()
              });


              if (includeTable.length > 0){

                //console.log(includeTable)
                includeTable.forEach(function(include) {

                  
                  const tables = include.split('.')

                  var actualTable = tableName
                  var rutaObj = ''
                  tables.forEach(function(table, i) {

                    rutaObj = `._include.${tables[i-1]}`

                    //console.log(i)
                    //console.log(table)
                    //console.log(qr)
                    if(i == 0){
                      let distinct = Enumerable.from(qr).where(`$.${tableName}.id == "${obj[tableName].id}" && $.${table}.id != null`).distinct(`$.${table}.id`).select(function(obj2){
                        return obj2[table]
                      }).toArray()
                      console.log(0)
                      linObj._include[table] = distinct
                    } else {
                    console.log(1)
                      //console.log(`${tables[i-1]}.${table}Id`)

                      //console.log()

                      //console.log(`${obj[tables[i-1]]}[${table}Id]`)
                      //console.log(`${obj[tables[i-1]]}`)
                      //console.log(obj[tables[i-1]][`${table}Id`])
                      //let objTablaActual = Enumerable.from(obj).where(`$.${tables[i-1]}.${table}Id == "${obj[tables[i-1]][`${table}Id`]}" && $.${table}.id != null`).distinct(`$.${table}.id`).select(function(obj2){
                      //let objTablaActual = Enumerable.from(qr).where(`$.${table}.id == "${obj[tables[i-1]][`${table}Id`]}" && $.${table}.id != null`).distinct(`$.${table}.id`).select(function(obj2){
                      let objTablaPadre = Enumerable.from(qr).where(`$.${tableName}.id == "${obj[tableName].id}" && $.${table}.id != null`).distinct(`$.${tables[i-1]}.id`).select(function(obj2){
                          //console.log(obj2[tables[i-1]])
                       
                        return obj2[tables[i-1]]
                      }).toArray()

                     
                      objTablaPadre.forEach(function(item, j){
                        let objTablaActual = Enumerable.from(qr).where(`$.${tableName}.id == "${obj[tableName].id}" && $.${tables[i-1]}.id == "${item.id}" && $.${table}.id != null`).distinct(`$.${tables[i-1]}.id`).select(function(obj3){
                          var test = obj3[table]
                          
                          console.log(item)
                          return test
                        }).toArray()

                        lodash.set(linObj, `${rutaObj}[${j}]._include`, objTablaActual)
                      })
                      
                      /*
                      var arreglo = ['test', 'sego', 'sfdf']

                      var str = join(arreglo, 'core_person['+i+']._include')

                      var c = 'core_person[{inte1}]._include'
                      algo(c, 'hola')
                      */

                      //console.log(objTablaPadre)
                    }

                  
                    //rutaObj = (rutaObj == '') ? `${table}[0]._include` : `${rutaObj}[0]._include.${table}`

                    
                    /*
                    if(actualTable == tableName){
                      let distinct = Enumerable.from(qr).where(`$.${tableName}.id == "${obj[tableName].id}" && $.${table}.id != null`).distinct(`$.${table}.id`).select(function(obj2){
                        return obj2[table]
                      }).toArray()

                      //linObj._include[table] = distinct
                    } else {

                      let objTableActual = Enumerable.from(qr).distinct()

                      let distinct = Enumerable.from(qr).where(`$.${actualTable}.id == "${obj[actualTable].id}" && $.${table}.id != null`).distinct(`$.${table}.id`).select(function(obj2){
                        return obj2[table]
                      }).toArray()

                      //lodash.set(linObj._include, rutaObj, distinct)
                      //lodash.set(linObj._include, `${table}`, distinct)
                      //linObj._include[table] = distinct

                    }
                    */

                    actualTable = table
                  })

                });
              }

              

              return linObj
          }).toArray()
              
          
          var response = {}
          
          response.data = lin
          if (pagination){ 
            response = this.makePagination(request, pag, response)
          }

          return response//ResponseBuilder.create(request, qr, pagination)

        } catch (e) {
          console.log(e)
          throw new TechnicalException()
        }
      }

      /**
       * @version Vtest
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


      makePagination (request, data, response){
    
        const page = request.input('page')
  
        if(page.size == 0)
        {
          throw new TechnicalException('El tamaño de la pagina no puede ser 0');
        }
  
        const url = `${request.protocol()}://${request.header('host')}`
  
        const totalPages = Math.ceil(data / page.size)
  
        response.meta = {
          totalPages: `${totalPages}`,
          totalRecords: `${data}`,
          currentPage: `${page.number}`,
          currentSize: `${page.size}`
        }
  
        var self, first, prev, next, last = ""
  
        self =  `${url}${request.originalUrl()}`
        first = encodeURI(`${url}${request.url()}?page[number]=1&page[size]=${page.size}`)
        prev =  (page.number-1 <= 0) ? "" :  encodeURI(`${url}${request.url()}?page[number]=${page.number-1}&page[size]=${page.size}`)
        next =  (parseInt(page.number) >= parseInt(totalPages)) ? "" : encodeURI(`${url}${request.url()}?page[number]=${page.number-0+1}&page[size]=${page.size}`)
        last =  encodeURI(`${url}${request.url()}?page[number]=${data.total}&page[size]=${page.size}`)
        
  
        response.links = {
            self: self,
            first: first,
            prev: prev,
            next: next,
            last: last
        }
  
        return response
    }


    }
    
    module.exports = Vtest