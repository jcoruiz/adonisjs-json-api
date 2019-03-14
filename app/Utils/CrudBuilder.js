'use strict'

const TechnicalException = use('App/Exceptions/TechnicalException');


const Database = use('Database')
const data = use('App/Utils/Data')
const ResponseBuilder = use('App/Utils/ResponseBuilder')
const Sorting = use('App/Utils/Sorting')


class CrudBuilder {

  async readAll (request, page, sort, filter, pagination, schema) {

    try {
      //Get Sort String with validation of field only when var sort length is greather than 0
      const sortString = (sort.length == 0) ? '' : Sorting.make(sort, schema)

      const coneccion = await data.getConeccionCliente("")
      Database.Config._config.database.default=coneccion

      //Select
      var qr = Database.table(schema.tableName).column(schema.columns).select()

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

  

}

module.exports = new CrudBuilder;