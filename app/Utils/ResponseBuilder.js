'use strict'

const TechnicalException = use('App/Exceptions/TechnicalException');
const validateJson = use('App/Utils/ValidateJson')


class ResponseBuilder {

  create (request, data, pagination, count) {
    try {
      var response = {}
      //console.log(data.data)
      response.data = data.data
      if (pagination){ 
        //response = this.makePagination(request, count, response)
      }
      return response
    } catch (e) {
      throw new TechnicalException(e);
    }
  }

}

module.exports = new ResponseBuilder;