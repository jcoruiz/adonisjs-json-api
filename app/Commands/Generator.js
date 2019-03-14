'use strict'

const data = use('App/Utils/Data')
const Database = use('Database')
const { Command } = require('@adonisjs/ace')
const fs = use('fs');
const mkdirp = use('mkdirp')
const Helpers = use('Helpers')
const Enumerable = require('linq')

const { exec } = require('child_process');

class Generator extends Command {
  static get signature () {
    return 'generator'
  }

  static get description () {
    return 'Tell something helpful about this command, please'
  }

  async handle (args, options) {

    //Se trae los schemas diponibles en la conexion
    var qSchema = 'SELECT DISTINCT TABLE_SCHEMA FROM INFORMATION_SCHEMA.TABLES;';
    const rSchema = await data.execQuery(qSchema, "_ace");
    const schemas = Enumerable.from(rSchema[0]).select(function(sch){
        return sch.TABLE_SCHEMA;
    }).toArray();

    //Se pregunta que esquema utilizar
    const schema = await this.choice('BD', schemas);

    //Se trae las tablas del schema seleccionado
    var qTablas= `SELECT DISTINCT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA='${schema}';`;
    const rTablas   = await data.execQuery(qTablas, "_ace");
   
    const tablas = Enumerable.from(rTablas[0]).select(function(sch){
        return sch.TABLE_NAME;
    }).toArray();

    //Se pregunta que tablas se quieren utilizar
    const seleccionadas = await this.multiple('Tabla', tablas);
    
    //Se itera por cada una de las tablas seleccionadas
    for(var i in seleccionadas){

      var table = seleccionadas[i]
      var module = table.split("_")[0]
      var tableName = table.split("_")[1]

      const version = await this.ask(`Ingrese version para la tabla :${table}`)
      
      //Se trae las columnas de la tabla actual
      var query = ` SELECT 
                    * 
                    FROM INFORMATION_SCHEMA.COLUMNS
                    WHERE TABLE_NAME='${table}'
                    AND TABLE_SCHEMA='${schema}';`;
      
      const rColumns   = await data.execQuery(query, "_ace");
      

      const tableSchema = await this.makeSchema(rColumns[0], table)


      const implementar = await this.choice('Desea implementar un metodo de prueba (esto sobreescribe la clase custom)', ["NO","SI"])



      this.generateController(module, tableName)
      this.generateIndex(module, tableName)
      this.generateVersion(module, tableName, version, tableSchema)
      
      if(implementar == "SI"){
        this.generateControllerCustom(module, tableName)
        this.generateIndexCustom(module, tableName)
        this.generateVersionCustom(module, tableName, version, tableSchema)
      }

      exec('grunt jsdoc', (err, stdout, stderr) => {
        if (err) {
          // node couldn't execute the command
          return;
        }
      
        // the *entire* stdout and stderr (buffered)
        this.info(`stdout: ${stdout}`);
        this.info(`stderr: ${stderr}`);
      });
      
     }

    return;
  }

  async generateController(module, table){
    const context = this;

    const tableCapitalized = table.charAt(0).toUpperCase() + table.slice(1)

    var body =`'use strict'

    const Service${tableCapitalized}CRUD = use('App/Services/crud/${module}/${table}/')
    
    class ${table}CRUD {
        async create({request,response,auth}){
          var version = request.params.version
          var obj = Service${tableCapitalized}CRUD.getVersion(version)
          return await obj.create(...arguments)
      }

      async readAll({request,response,auth}){
          var version = request.params.version
          var obj = Service${tableCapitalized}CRUD.getVersion(version)
          return await obj.readAll(...arguments)
      }

      async read({request,response,auth}){
          var version = request.params.version
          var obj = Service${tableCapitalized}CRUD.getVersion(version)
          return await obj.read(...arguments)
      }

      async update({request,response,auth}){
          var version = request.params.version
          var obj = Service${tableCapitalized}CRUD.getVersion(version)
          return await obj.update(...arguments)
      }

      async delete({request,response,auth}){
          var version = request.params.version
          var obj = Service${tableCapitalized}CRUD.getVersion(version)
          return await obj.delete(...arguments)
      } 
    }
    
    module.exports = ${table}CRUD`;

    const links = [
      `app/Controllers/Http/crud`,
      `app/Controllers/Http/crud/${module}`
    ]

    this.saveFile(context,`app/Controllers/Http/crud/${module}`,links,`${table}CRUD.js`,body);
  }

  async generateControllerCustom(module, table){
    const context = this;
    const tableCapitalized = table.charAt(0).toUpperCase() + table.slice(1)
    var body =`'use strict'

    const ${table}CRUD = use('App/Controllers/Http/crud/${module}/${table}CRUD')
    const Service${tableCapitalized} = use('App/Services/${module}/${table}/')
    
    class ${table} extends ${table}CRUD {
        async placeholder({request,response,auth}){
          var version = request.params.version
          var obj = Service${tableCapitalized}.getVersion(version)
          return await obj.placeholder(...arguments)
      }
    }
    
    module.exports = ${table}`;

    const links = [
      `app/Controllers/Http/${module}`
    ]

    this.saveFile(context,`app/Controllers/Http/${module}`,links,`${table}.js`,body);
  }

  async generateIndex(module, table){
    const context = this;
    var body =`'use strict'

    class ${table} {
      static getVersion (version) {
        return new (use(\`App/Services/crud/${module}/${table}/\${version}\`))()
      }
    }
      
  module.exports = ${table}`;

    const links = [
      `app/Services`,
      `app/Services/crud`,
      `app/Services/crud/${module}`,
      `app/Services/crud/${module}/${table}`
    ]

    this.saveFile(context, `app/Services/crud/${module}/${table}`, links, `Index.js`,body);
  }

  async generateIndexCustom(module, table){
    const context = this;
    var body =`'use strict'

    class ${module} {
      static getVersion (version) {
        return new (use(\`App/Services/${module}/${table}/\${version}\`))()
      }
    }
      
  module.exports = ${module}`;

    const links = [
      `app/Services`,
      `app/Services/${module}`,
      `app/Services/${module}/${table}`
    ]

    this.saveFile(context, `app/Services/${module}/${table}`, links, `Index.js`,body);
  }

  async generateVersion(module, table, version, tableSchema){
    const context = this;
    tableSchema = JSON.stringify(tableSchema)
    var body =`'use strict'

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
     * Esta clase está encargada de administrar la tabla ${table}
     * @extends V${version}Crud
     * @namespace ${table}.V${version}
     * @class
     * 
     */
    class V${version} {
      tableSchema () {
        return ${tableSchema}
      }

      /**
       * @version V${version}
       * @author Jonathan (Johnny) Olivares
       * @description
       * Create an Entity in the table ${table}
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
       * POST: {Protocol}://{Server}:{Port}/{Client}/{Version}/${module}/${table}
       * {
       *  "name": "name",
       *  "lastName": "lastName"
       * }
       * @example <caption>Response 201:</caption>
       * {@lang bash}
       * HEADER:
       *  Location: {protocol}://{server}:{port}/{client}/{version}/${module}/${table}/{id}
       * JSON:
       * {
       *    "data": [
		   *      {
			 *        "links": {
			 *          "self": "{protocol}://{server}:{port}/{client}/{version}/${module}/${table}/{id}"
			 *        }
	     *      }
	     *    ]
       * }
       * 
       * @function
       * @memberof ${table}.V${version}
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

          const url = \`\${request.protocol()}://\${request.header('host')}\`
          const location = encodeURI(\`\${url}\${request.url()}/\${id}\`)

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
       * @version V${version}
       * @description
       * Update an Entity in the table ${table}
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
       * PATCH {Protocol}://{Server}:{Port}/{Client}/{Version}/${module}/${table}/{id}
       * {
       *    "data" : {
       *      "type": "${module}_${table}",
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
       * @memberof ${table}.V${version}
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
       * @version V${version}
       * @description
       * Delete Entity (Logical) in the table ${table}
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
       * DELETE {Protocol}://{Server}:{Port}/{Client}/{Version}/${module}/${table}/{id}
       * 
       * @example <caption>Response 204:</caption>
       * {@lang json}
       * NO-CONTENT
       * @function
       * @memberof ${table}.V${version}
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
       * @version V${version}
       * @description
       * Create an Entity in the table ${table}
       * @example <caption>Request:</caption>
       * {@lang bash}
       * POST: {Protocol}://{Server}:{Port}/{Client}/{Version}/${module}/${table}/
       * {
       *    "page":{
		   *      "number":"",
		   *      "size": ""
	     *    },
	     *    "sort": "",
       *    "filter": {
       *      "type": "incremental",
       *      "search": "",
       *      "in": ["fieldName1", "fieldName2"]
       *    } 
       * }
       * 
       * @example <caption>Response:</caption>
       * {@lang json}
       * 
       * @function
       * @memberof ${table}.V${version}
       * 
      */
      async readAll ({request, response, auth}) {
        try{
          const page = validateJson.validate(request.input('page'))
          const sort = request.input('sort')
          const filter = validateJson.validate(request.input('filter'))
          
          const pagination = true

          //Get Sort String with validation of field only when var sort length is greather than 0
          const sortString = (sort.length == 0) ? '' : Sorting.make(sort, this.tableSchema())

          const coneccion = await data.getConeccionCliente("")
          Database.Config._config.database.default=coneccion

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
                  obj.orWhere(\`\${field}\`, 'like', \`%\${search}%\`)
                })
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

          //console.log(qr.toString())
             
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
       * @version V${version}
       * @description
       * Read an Entity in the table ${table}
       * @example <caption>Request:</caption>
       * {@lang bash}
       * POST: {Protocol}://{Server}:{Port}/{Client}/{Version}/${module}/${table}/{id}
       * 
       * @example <caption>Response:</caption>
       * {@lang json}
       * [
       * {}
       *   ]
       * 
       * @function
       * @memberof ${table}.V${version}
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
    
    module.exports = V${version}`;
    
    const links = [
      `app/Services`,
      `app/Services/crud`,
      `app/Services/crud/${module}`,
      `app/Services/crud/${module}/${table}`
    ]
    this.saveFile(context, `app/Services/crud/${module}/${table}`, links, `V${version}.js`, body);
  }

  async generateVersionCustom(module, table, version, tableSchema){
    const context = this;
    tableSchema = JSON.stringify(tableSchema)
    var body =`'use strict'

    const Database = use('Database')
    const data = use('App/Utils/Data')
    const ResponseBuilder = use('App/Utils/ResponseBuilder')
    const Logger = use('Logger')
    const TechnicalException = use('App/Exceptions/TechnicalException')
    const uuidv4 = require('uuid/v4')
    
    /**
     * Esta clase está encargada de administrar la tabla ${table}
     * @name V${version}
     * @namespace ${table}.V${version}Crud
     * @class
     * 
     */
    class V${version} {

      /**
       * @version V${version}       
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
       * POST: {Protocol}://{Server}:{Port}/{Client}/{Version}/${module}/${table}
       * {
       *  "name": "name",
       *  "lastName": "lastName"
       * }
       * @example <caption>Response 201:</caption>
       * {@lang bash}
       * HEADER:
       *  Location: {protocol}://{server}:{port}/{client}/{version}/${module}/${table}/{id}
       * JSON:
       * {
       *    "data": [
		   *      {
			 *        "links": {
			 *          "self": "{protocol}://{server}:{port}/{client}/{version}/${module}/${table}/{id}"
			 *        }
	     *      }
	     *    ]
       * }
       * 
       * @function
       * @memberof ${table}.V${version}
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
    
    module.exports = V${version}`;
    
    const links = [
      `app/Services`,
      `app/Services/${module}`,
      `app/Services/${module}/${table}`
    ]
    this.saveFile(context, `app/Services/${module}/${table}`, links, `V${version}.js`, body);
  }

  async saveFile(context, folder, links, filename, body){
   
    var path = Helpers.appRoot(`${folder}`)
    var pathFile = `${path}/${filename}`
    
    links.forEach(link => {
      if (!fs.existsSync(Helpers.appRoot(link))){
        fs.mkdirSync(Helpers.appRoot(link))
      }
    });
    
    fs.writeFile(pathFile, body, function(err) {
      if(err) {
        console.log(err)  
        return
      }
      context.info(`Se creó ${pathFile} correctamente`)
    }); 
  }

  async makeSchema(schema, table){

    var fields = []
    var columns = []
    
    schema.forEach(column => {
      fields.push({fieldName:column.COLUMN_NAME}),
      columns.push(column.COLUMN_NAME)
    })

    return {
      tableName: table,
      fields: fields,
      columns: columns
    }
    
  }
}

module.exports = Generator
