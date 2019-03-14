'use strict'

    class role {
      static getVersion (version) {
        return new (use(`App/Services/crud/core/role/${version}`))()
      }
    }
      
  module.exports = role