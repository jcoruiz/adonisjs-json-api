'use strict'

    const ServiceGenderCRUD = use('App/Services/crud/core/gender/')
    
    class genderCRUD {
        async create({request,response,auth}){
          var version = request.params.version
          var obj = ServiceGenderCRUD.getVersion(version)
          return await obj.create(...arguments)
      }

      async readAll({request,response,auth}){
          var version = request.params.version
          var obj = ServiceGenderCRUD.getVersion(version)
          return await obj.readAll(...arguments)
      }

      async read({request,response,auth}){
          var version = request.params.version
          var obj = ServiceGenderCRUD.getVersion(version)
          return await obj.read(...arguments)
      }

      async update({request,response,auth}){
          var version = request.params.version
          var obj = ServiceGenderCRUD.getVersion(version)
          return await obj.update(...arguments)
      }

      async delete({request,response,auth}){
          var version = request.params.version
          var obj = ServiceGenderCRUD.getVersion(version)
          return await obj.delete(...arguments)
      } 
    }
    
    module.exports = genderCRUD