'use strict'

    class core {
      static getVersion (version) {
        return new (use(`App/Services/core/gender/${version}`))()
      }
    }
      
  module.exports = core