'use strict'

    class person {
      static getVersion (version) {
        return new (use(`App/Services/crud/core/person/${version}`))()
      }
    }
      
  module.exports = person