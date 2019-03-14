'use strict'

    class core {
      static getVersion (version) {
        return new (use(`App/Services/core/person/${version}`))()
      }
    }
      
  module.exports = core