'use strict'

const TechnicalException = use('App/Exceptions/TechnicalException');


class Sorting {

  /**
     * EN CASO DE EXITO
     * @version 1.0.0
     * @example
     * {@lang javascript}
     * success (result, message_if_empty);
     * @function
     * @param  {Array<Object>} result Recordset
     * @param  {string} message_if_empty mensaje en caso que el Recordset esté vacío
     * @return {response} 
     * @example
     * {@lang javascript}
     * {
     *   status: {
     *     code : null,
     *     message : null,
     *     detail : null
     *   },
     *   data: null
     * }
     */
  make (sort, structure='') {
    try {
      //console.log(sort)
      const sortArray = sort.split(",")
      var sortResult = []
      var fields = []
      
      sortArray.forEach(element => {
        var direction = 'asc'
        var field = element

        if(element.substring(0,1)=="-")
        {
          direction = 'desc'
          field = field.substring(1)
        }
        sortResult.push(`${field} ${direction}`)     
        fields.push(field)   
      });

      if(structure!='')
      {
        this.validateStructure(fields, structure)
      }


      return sortResult.join(', ')
    } catch (e) {
      throw new TechnicalException(e)
    }
  }

  validateStructure (sort, structure){
    
    sort.forEach(element => {
      var obj = structure.fields.find(o => o.fieldName === element)

      if(obj == null)
      {
        throw new TechnicalException(`Field ${element} not valid for order in table in this version`);
      }
      
    })
    
  }
  

}

module.exports = new Sorting;