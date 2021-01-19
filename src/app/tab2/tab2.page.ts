import { Component } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AlertController } from '@ionic/angular';
const { Storage } = Plugins;


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  InputForm: FormGroup;

  constructor(private router: Router, public formBuilder: FormBuilder, private alertController : AlertController) {
    this.InputForm = formBuilder.group({
      total: ["", Validators.compose([Validators.required])],
      purpose: ["", Validators.compose([Validators.required])],
      description: [""]
    });
  }

  submit(inputData : any){
    let key = new Date();
    
    inputData.costExp = [];
    inputData.date = key.toLocaleDateString('en-GB');

    console.log(inputData);

    Storage.set({
      key: key.valueOf().toString(),
      value: JSON.stringify(inputData)
    })
    this.successAlert();
  }

  async successAlert(){
    await this.alertController.create({
      message: 'You have successfully created an expense card',
      buttons: [
        {
          text: 'Okay',
          handler: () => {
            this.InputForm.reset();
            this.router.navigate(['/tabs/tab1']);
          }
        }
      ]
    }).then(alert => {
      alert.present();
    });

    
  }

}
