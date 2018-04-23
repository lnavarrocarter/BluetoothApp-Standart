import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

@Injectable()
export class StorageProvider {
  dbServices : any;
  constructor(private sqlite: SQLite) {
    console.log('Hello StorageProvider Provider');
  }
  

  onCreateSQL(){
    console.log('Create Table SQLlITE')
    this.sqlite.create({
      name: 'SD.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        this.dbServices = db
        db.executeSql('create table ST(name VARCHAR(32),macadress VARCHAR(100),status VARCHAR(100))', {})
          .then(() => console.log('Executed SQL'))
          .catch(e => console.log(e));
          
    
    
      })
      .catch(e => console.log(e));
  }

  readDataTable(query: string){
    return this.dbServices.executeSql(query);
  }

  saveDataTable(query: string){
    return this.dbServices.executeSql(query);
  }
  

}
