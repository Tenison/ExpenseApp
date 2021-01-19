import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;

import { ExpenseOne } from '../exp/exp.model';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-exp',
  templateUrl: './exp.page.html',
  styleUrls: ['./exp.page.scss'],
})
export class ExpPage implements OnInit {
  exp: ExpenseOne ;
  key :string;
  currentAmount : number;

  constructor(private activatedRoute: ActivatedRoute, public alertController: AlertController) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((paraMap) =>{
      this.exp = {
            total: '',
            purpose: '',
            description: '',
            date: '',
            costExp: []
      }

      const id = paraMap.get('id');
      console.log(id);
      this.key = id;
      this.getExpense(id);
    });
  }

  async getExpense(key: string) {
    const newObjs = {key: key};
    const ret = await Storage.get(newObjs);
    
    this.exp =  JSON.parse(ret.value);
    let temp : any;
    ///for current Amount
    const totalExp = parseFloat(this.exp.total);
    this.currentAmount = 0;
    JSON.parse(ret.value).costExp.forEach( data=>{
      this.currentAmount +=  parseFloat(data.amount);
    });
    this.currentAmount= totalExp - this.currentAmount;
    this.currentAmount = parseFloat(this.currentAmount.toFixed(2));
    ///ends here
  }

  updateCurrentAmount(){
    this.currentAmount = 0;
    const totalExp = parseFloat(this.exp.total);
    this.exp.costExp.forEach( data=>{
      this.currentAmount += parseFloat(data.amount);
    });
    this.currentAmount= totalExp - this.currentAmount;
    this.currentAmount = parseFloat(this.currentAmount.toFixed(2));
  }


  async addDetails(){
    await this.alertController.create({
      cssClass: 'my-custom-class',
      header: '',
      inputs: [
        {
          name: 'expense',
          type: 'number',
          id: 'total',
          placeholder: 'Expense Amount'
        },
        // multiline input.
        {
          name: 'purpose',
          id: 'purpose',
          type: 'textarea',
          placeholder: 'Expense Purpose'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Add',
          handler: (alertData) => {
            let temp = {
              reason: alertData.purpose,
              amount: alertData.expense
            }

            this.exp.costExp.push(temp);

            Storage.set({
              key: this.key,
              value: JSON.stringify(this.exp)
            });   

            this.updateCurrentAmount();
          }
        }
      ]
    }).then(alert =>{
      alert.present();
    });
  }

  async removeItem(amount: string){
    await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirm Delete',
      message: 'Are you sure you want to delete',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Delete',
          handler: () => {
            this.exp.costExp = this.exp.costExp.filter(function(el) {
              return el.amount != amount; 
            });
        
            Storage.set({
              key: this.key,
              value: JSON.stringify(this.exp)
            });

            this.updateCurrentAmount();
          }
        }
      ]
    }).then(alert => {
      alert.present();
    });  
  }
}
