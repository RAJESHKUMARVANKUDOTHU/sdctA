import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../api.service';
import { LoginCheckService } from '../login-check.service';
import { GeneralMaterialsService } from '../general-materials.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  workingForm:FormGroup
  loginData:any
  shifts:any=[
    {
      name:"Shift1 Morning Shift"
    },
    {
      name:"Shift2 Afternoon Shift"
    },
    {
      name:"Shift3 Night Shift"
    }
  ]
  constructor(private fb:FormBuilder,private api:ApiService,private login:LoginCheckService,private general:GeneralMaterialsService) { }

  ngOnInit(): void {
    this.loginData = this.login.Getlogin()
    this.loginData = JSON.parse(this.loginData)



    this.workingForm = this.fb.group({
      shift: ['', Validators.required],
      fromTime: ['', Validators.required],
      toTime: ['', Validators.required]
    });
  }


  onSubmit(data) {
     if (this.workingForm.valid) {
       try {
         console.log("time data===",data)
         data.userId = this.loginData.userId
         this.api.setTime(data).then((res:any)=>{
           console.log("time insrted or updated",res)
           if(res.status){
             var msg = 'Shift time updated Successfully'
             this.general.openSnackBar(msg,'')
             this.workingForm.reset()
           }
         })
       } catch (err) {
       }
     }
   }

}
