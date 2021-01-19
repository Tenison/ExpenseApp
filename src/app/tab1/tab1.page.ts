import { Component } from '@angular/core';
import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;

import { Expense } from '../app.model';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  exp: Expense;
  hold: Expense[];
  expenses: Expense[];

  constructor(public alertController: AlertController) {}

  // ngOnInit(){
  //   this.getAllObject();
  //   this.expenses = this.hold;
  //   console.log(this.expenses);
  // }

  ionViewWillEnter() {
    this.getAllObject();
    this.expenses = this.hold;
  }

  async getAllObject(){
    this.hold = [];
    const ret = await Storage.keys().then((keyData) =>{
      return keyData.keys;
    }).then( data => {
      //convert "data" array integer and do a descending sort
      let temp = data.map(Number).sort((a, b) => b - a);

      temp.forEach( async (value) => {
        const newObj = {key: value.toString()};
        const ret = await Storage.get(newObj);
        let result = {
          key: value.toString(),
          data: JSON.parse(ret.value)
        }
        this.hold.push(result);
        //console.log(result);
        //return JSON.parse(ret.value);
      });
    });
    //console.log(this.hold);
    return [...this.hold];
  }

  async deleteExp(id: string){
    const newObj = {key: id};

    await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirm Delete',
      message: 'Are you sure you want to delete',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.getAllObject();
            this.expenses = this.hold;
          }
        }, {
          text: 'Delete',
          handler: () => {
            Storage.remove(newObj);
            this.getAllObject();
            this.expenses = this.hold;
          }
        }
      ]
    }).then(alert => {
      alert.present();
    });

    
  }

  async getSingleExp(key: string) {
    
    const newObjs = {key: key};
    const ret = await Storage.get(newObjs);
    
     return this.exp = {
      key : key,
      data: JSON.parse(ret.value)
    }
  }

  async editExp(id: string){
    let result:any  = {};
    const newObjs = {key: id};
    const ret = await Storage.get(newObjs);
    
    this.exp = {
      key : id,
      data: JSON.parse(ret.value)
    }

    await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Edit Expense Amount',
      inputs: [
        {
          name: 'total',
          type: 'number',
          id: 'total',
          value: this.exp.data.total,
          placeholder: 'Total Eg: 5000.00'
        },
        {
          name: 'purpose',
          type: 'text',
          id: 'purpose',
          placeholder: 'Purpose',
          value: this.exp.data.purpose
        },
        // multiline input.
        {
          name: 'description',
          id: 'description',
          type: 'textarea',
          placeholder: 'Description',
          value: this.exp.data.description
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.getAllObject();
            this.expenses = this.hold;
          }
        }, {
          text: 'Update',
          handler: (alertData) => {
            result.total = alertData.total;
            result.purpose = alertData.purpose;
            result.description = alertData.description;
            result.date = this.exp.data.date;
            result.costExp = this.exp.data.costExp;

            Storage.set({
              key: id,
              value: JSON.stringify(result)
            });

            this.getAllObject();
            this.expenses = this.hold;
          }
        }
      ]
    }).then(alert =>{
      alert.present();
    });
  }
}
