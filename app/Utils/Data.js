'use strict'
const Database = use('Database')

const Env = use('Env')
const Helpers = use('Helpers')

/**
 * Esta clase está encargada de manejar las llamadas a la base de datos
 * @name Data
 * @class
 * 
 */
class Data  {
    /**
     * Ejecuta consulta en BD
     * @version 1.0.0
     * @deprecated since version 2.0
     * @example
     * // returns 2
     * globalNS.method1(5, 10);
     * @param  {string} client Es el nombre de dominio del cliente
     * @param  {string} query Consulta a la base de datoss
     */
    async execQuery(query, cliente = ""){
        
        var coneccion = ""

        if(cliente == ""){
            coneccion = await this.getConeccionCliente("");
        } else if(cliente == "_ace"){
            coneccion = await this.getConeccionAce("");
        } else {

        }

        Database.Config._config.database.default=coneccion;
        
        try{
            const result = await Database.connection('default').schema.raw(query);
        
            Database.close(['default'])
            Database.close()
            return result;
        }catch(ex){
            Database.close(['default'])
            Database.close()
            return ex;
        }  
    }
    /**
     * 
     * @param  {string} client Es el nombre de dominio del cliente
     */
    async getConeccionCliente (client){ 
        /*if(client == "localhost" || client=="hrmdev"){
            client = "hrm";
        }
        var bd = "";
        
        var query =`select * from Cliente where domain = '${client}'`;
        const result = await Database.connection('app').schema.raw(query);
        
        if(client=='app'){
            bd="hrmapp";
        }else{
            bd = result[0][0].bd;
        }
        
        var bdDefault = Env.get('BD_DEFAULT', '');
        if(bdDefault!=''&& client!="app"){
            bd=bdDefault;
        }*/
        const coneccion ={client:'mysql',connection:{
            host: Env.get('DB_HOST', 'localhost'),
            port: Env.get('DB_PORT', '3306'),
            user: Env.get('DB_USER', 'root'),
            password: Env.get('DB_PASSWORD', 'Qwerty123'),
            database:Env.get('DB_DATABASE', 'test')
        }};
        return coneccion;
    }

    async getConeccionAce (client){ 
       
        const coneccion ={client:'mysql',connection:{
            host: 'localhost',
            port: '33066',
            user: 'root',
            password: 'Qwerty123',
            database:'app'
        }};
        return coneccion;
    }
}
module.exports = new Data
