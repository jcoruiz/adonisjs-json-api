'use strict'

    const genderCRUD = use('App/Controllers/Http/crud/core/genderCRUD')
    const ServiceGender = use('App/Services/core/gender/')
    
    class gender extends genderCRUD {
        async placeholder({request,response,auth}){
          var version = request.params.version
          var obj = ServiceGender.getVersion(version)
          return await obj.placeholder(...arguments)
      }
    }
    
    module.exports = gender