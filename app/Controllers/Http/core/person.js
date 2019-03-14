'use strict'

    const personCRUD = use('App/Controllers/Http/crud/core/personCRUD')
    const ServicePerson = use('App/Services/core/person/')
    
    class person extends personCRUD {
        async placeholder({request,response,auth}){
          var version = request.params.version
          var obj = ServicePerson.getVersion(version)
          return await obj.placeholder(...arguments)
      }
    }
    
    module.exports = person