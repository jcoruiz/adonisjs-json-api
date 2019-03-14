'use strict'

const TechnicalException = use('App/Exceptions/TechnicalException')

class Pagination {

  make (request, count, response){
    
    const page = request.input('page')

    if(page.size == 0)
    {
      throw new TechnicalException('El tamaño de la pagina no puede ser 0');
    }

    const url = `${request.protocol()}://${request.header('host')}`

    const totalPages = Math.ceil(count / page.size)

    response.meta = {
      totalPages: totalPages,
      totalRecords: count,
      currentPage: page.number,
      currentSize: page.size
    }

    var self, first, prev, next, last = ""

    self =  `${url}${request.originalUrl()}`
    first = encodeURI(`${url}${request.url()}?page[number]=1&page[size]=${page.size}`)
    prev =  (page.number-1 <= 0) ? "" :  encodeURI(`${url}${request.url()}?page[number]=${page.number-1}&page[size]=${page.size}`)
    next =  (parseInt(page.number) >= parseInt(totalPages)) ? "" : encodeURI(`${url}${request.url()}?page[number]=${page.number-0+1}&page[size]=${page.size}`)
    last =  encodeURI(`${url}${request.url()}?page[number]=${count.total}&page[size]=${page.size}`)
    

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

module.exports = new Pagination