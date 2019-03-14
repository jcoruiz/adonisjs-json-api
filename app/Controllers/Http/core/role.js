'use strict'

    const roleCRUD = use('App/Controllers/Http/crud/core/roleCRUD')
    const ServiceRole = use('App/Services/core/role/')
    
    class role extends roleCRUD {
        async placeholder({request,response,auth}){
          var version = request.params.version
          var obj = ServiceRole.getVersion(version)
          return await obj.placeholder(...arguments)
      }
    }
    
    module.exports = role