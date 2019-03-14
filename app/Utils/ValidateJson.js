'use strict'

class ValidateJson {
  validate (obj){
    var response = obj
    if(obj == null || obj == ''){
      response = ''
    } else if(typeof obj == 'string'){
        response = JSON.parse(obj)
    }
    return response
  }
}

module.exports = new ValidateJson