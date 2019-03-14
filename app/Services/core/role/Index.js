'use strict'

    class core {
      static getVersion (version) {
        return new (use(`App/Services/core/role/${version}`))()
      }
    }
      
  module.exports = core