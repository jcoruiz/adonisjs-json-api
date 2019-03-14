'use strict'

    class gender {
      static getVersion (version) {
        return new (use(`App/Services/crud/core/gender/${version}`))()
      }
    }
      
  module.exports = gender