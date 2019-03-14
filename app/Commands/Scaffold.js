'use strict'
const data = use('App/Utils/Data')
const { Command } = require('@adonisjs/ace')
const fs = use('fs');
const Helpers = use('Helpers')
var Enumerable = require('linq');
class Scaffold extends Command {
  static get signature () {
    return 'scaffold'
  }

  static get description () {
    return 'Crea estructura de mantenedor para tabla'
  }
  async add(context,schema,table){
    var inParams = "";
    var insert = "";
    var nombreSp=`${table}_add`
    for(var i in schema){
      
      var param ="";
      var value ="";
      var comma=")";
      if(schema.length-1>i){
        comma=",";
      }
      if(schema[i].COLUMN_KEY=="PRI"){
        value = `UUID(),`
      }else{
        param = `in _${schema[i].COLUMN_NAME} ${schema[i].COLUMN_TYPE}${comma}`
        inParams +=param;
        if(schema[i].COLUMN_NAME=="dt_mod" || schema[i].COLUMN_NAME=="dt_cre"){
          value = `now()${comma}`
        }else{
          value = `_${schema[i].COLUMN_NAME}${comma} `
        }
        
      }


      
      insert += value;
    }
    var body =`DELIMITER $$
    CREATE DEFINER=\`root\`@\`localhost\` PROCEDURE \`${nombreSp}\`(
    ${inParams}
    BEGIN
        
        insert into ${table} values(${insert};
    
    END$$
    DELIMITER ;
    
    `;
    
    this.saveFile(context,table,`${table}_add.sql`,body);
  }

  async getAll(context,schema,table){
    
    var nombreSp=`${table}_getAll`
    var body =`DELIMITER $$
    CREATE DEFINER=\`root\`@\`localhost\` PROCEDURE \`${nombreSp}\`()
    
    BEGIN
        
        select * from  ${table} ;
    
    END$$
    DELIMITER ;
    
    `;
    
    this.saveFile(context,table,`${nombreSp}.sql`,body);
  }
  async getById(context,schema,table){
    
    var nombreSp=`${table}_getById`
    var body =`DELIMITER $$
    CREATE DEFINER=\`root\`@\`localhost\` PROCEDURE \`${nombreSp}\`(_id varchar(45))
    
    BEGIN
        
        select * from  ${table} where id=_id;
    
    END$$
    DELIMITER ;
    
    `;
    
    this.saveFile(context,table,`${nombreSp}.sql`,body);
  }
  
  async saveFile(context,folder,filename,body){
    var path = Helpers.appRoot(`database/storedProcedures/${folder}`)
    

    if (!fs.existsSync(path)){
      fs.mkdirSync(path);
    }
    
    fs.writeFile(Helpers.appRoot(`database/storedProcedures/${folder}/${filename}`), body, function(err) {
      if(err) {
          return //console.log(err);
      }
  
      context.info(`Se creó /database/${folder}/${filename} correctamente`)
    }); 
  }
  async handle (args, options) {
    /*const table = await this
    .ask('Nombre de la Tabla')
    */
   var qSchema=   'select distinct TABLE_SCHEMA from INFORMATION_SCHEMA.TABLES;';
   const rSchema   = await data.execQuery(qSchema);
   const schemas = Enumerable.from(rSchema[0]).select(function(sch){
        return sch.TABLE_SCHEMA;
        
    }).toArray();
   const schema = await this.choice('BD', schemas);
   
   var qTablas= `select distinct TABLE_NAME from INFORMATION_SCHEMA.TABLES where TABLE_SCHEMA='${schema}';`;
   const rTablas   = await data.execQuery(qTablas);
   
   const tablas = Enumerable.from(rTablas[0]).select(function(sch){
        return sch.TABLE_NAME;
        
    }).toArray();
   
    const seleccionadas = await this.multiple('Tabla', tablas);
   
   
   for(var i in seleccionadas){
    var table = seleccionadas[i];
    
    var query = `select c.COLUMN_NAME,COLUMN_TYPE , COLUMN_KEY from 
    INFORMATION_SCHEMA.COLUMNS as c
    inner join INFORMATION_SCHEMA.KEY_COLUMN_USAGE as k on c.TABLE_NAME = k.TABLE_NAME
    where c.TABLE_NAME='${table}'  and CONSTRAINT_NAME='PRIMARY';`;



    const result   = await data.execQuery(query);
    const context = this;
    var tSchema = result[0];

   
    this.add(context,tSchema,table);
    this.getAll(context,tSchema,table);
    this.getById(context,tSchema,table);
   }

    

    return;
    
  }
}

module.exports = Scaffold
