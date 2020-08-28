import { Component, OnInit ,Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../api.service';
import { LoginCheckService } from '../login-check.service';
import { GeneralMaterialsService } from '../general-materials.service';

@Component({
  selector: 'app-edit-device',
  templateUrl: './edit-device.component.html',
  styleUrls: ['./edit-device.component.css']
})
export class EditDeviceComponent implements OnInit {
type:any
deviceData:any
Findform:FormGroup
gatewayform:FormGroup
userform:FormGroup
coinform:FormGroup
loginData:any
gateway:any=[]



  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditDeviceComponent>,
    @Inject(MAT_DIALOG_DATA)  data,
    private api: ApiService,
    private login:LoginCheckService,
    private general:GeneralMaterialsService
  ) {
    // console.log("data===",data)
    this.type=data.type
    this.deviceData=data.data
  }

  ngOnInit(): void {


    this.loginData = this.login.Getlogin()
    this.loginData = JSON.parse(this.loginData)
    this.Findform = this.fb.group({
      deviceName: ['', Validators.required],
      deviceId: [{value: '', disabled: true}, Validators.required],
      empId:[''],
      mobileNum:['',[Validators.minLength(10),Validators.maxLength(14)]],
      emailId: ['',[Validators.email]]

    });



    this.gatewayform = this.fb.group({
      deviceName: ['', Validators.required],
      deviceId: [{value: '', disabled: true}, Validators.required]
    });



    this.userform = this.fb.group({
      mobileNum: ['', [Validators.required,Validators.minLength(10),Validators.maxLength(14)]],
      emailId: ['',[Validators.email]]
    });

    this.coinform=this.fb.group({
      coinId: [{value: '', disabled: true}, Validators.required],
      coinName: ['', Validators.required],
      gatewayId:['', Validators.required],
    });

    if(this.type=='finds'){
      this.Findform.patchValue({
        deviceName: this.deviceData.deviceName,
        deviceId: this.deviceData.deviceId,
        mobileNum:this.deviceData.mobileNum=='-' ? '' : this.deviceData.mobileNum==undefined ? '-' : this.deviceData.mobileNum,
        emailId:this.deviceData.emailId=='-' ? '' : this.deviceData.emailId==undefined ? '-' : this.deviceData.emailId,
        empId:this.deviceData.empId=='-' ? '' : this.deviceData.empId==undefined ? '-' : this.deviceData.empId
      });
    }

    else if(this.type=='gateways'){
      this.gatewayform.patchValue({
        deviceName: this.deviceData.gatewayName,
        deviceId: this.deviceData.gatewayId
      });
    }

    else if(this.type=='users'){
      this.userform.patchValue({
        mobileNum: this.deviceData.mobileNum=='' ? '-' : this.deviceData.mobileNum==undefined ? '-' : this.deviceData.mobileNum,
        emailId: this.deviceData.emailId
      });
    }
    else if(this.type=='coins'){
      this.coinform.patchValue({
        coinId: this.deviceData.coinId,
        coinName: this.deviceData.coinName,
        gatewayId:this.deviceData.gatewayId,
      });
    }

    this.refreshGateway()
  }


  Findsubmit(data){
    console.log("find edit===",data)
    var mobNum=data.mobileNum.replace(/\s/g,'')
    console.log("mon num==",mobNum)
    data.mobileNum=mobNum==''?'-':mobNum=='+91'?mobNum.substring(3):mobNum
    if (this.Findform.valid) {
      try {
        console.log("find edit===",data)
        data.tblName='deviceRegistration'
        data.id=this.deviceData.id
        data.userId=this.deviceData.userId
        this.api.editDeviceRegister(data).then((res:any)=>{
          // console.log("find submit====",res);
          if(res.status){
            var msg = 'Device Updated Successfully'
            this.general.openSnackBar(msg,'')
          }
          else if(!res.status && res.alreadyExisted){
            var msg = 'Device Name Already exists, try different Name'
            this.general.openSnackBar(msg,'')
          }


        })
      } catch (err) {
      }
    }
  }



  Gatewaysubmit(data){
    if (this.gatewayform.valid) {
      try {
        data.tblName='gatewayRegistration'
        data.id=this.deviceData.id
        data.userId=this.deviceData.userId
        this.api.editDeviceRegister(data).then((res:any)=>{
          // console.log("gateway submit==",res)
          if(res.status){
            var msg = 'Gateway Registered Successfully'
            this.general.openSnackBar(msg,'')
          }
          else if(!res.status && res.alreadyExisted){
            var msg = 'Gateway Name Already exists, try different gateway'
            this.general.openSnackBar(msg,'')
          }
        })
      } catch (err) {
      }
    }
  }


  Usersubmit(data){

    if (this.userform.valid) {
      try {
        data.id=this.deviceData.id
        this.api.EditUserRegister(data).then((res:any)=>{
          // console.log("user submit==",res)
          if(res.status){
            var msg = 'User Registered Successfully'
            this.general.openSnackBar(msg,'')
          }
          else if(!res.status && res.alreadyExisted){
            var msg = 'Email id or Mobile Number Already exists, try different device'
            this.general.openSnackBar(msg,'')
          }
        })
      } catch (err) {
      }
    }
  }


  coinsubmit(data){
    if (this.coinform.valid) {
      try {
        data.id=this.deviceData.id
        this.api.editCoinRegister(data).then((res:any)=>{
          console.log("coin submit==",res)
          if(res.status){
            var msg = 'coin Registered Successfully'
            this.general.openSnackBar(msg,'')
          }
          else if(!res.status && res.alreadyExisted){
            var msg = 'Coin Name Already exists, try different Coin'
            this.general.openSnackBar(msg,'')
          }
        })
      } catch (err) {
      }
    }

  }
  refreshGateway(){
    var data={
        userId:this.loginData.userId,
        tblName:'gatewayRegistration'
      }

    this.api.getData(data).then((res:any)=>{
      console.log("gateway data ======",res);
      if(res.status){
        this.gateway=res.success


      }

    })
  }

  getNumber(event){
    console.log(" get number event==",event)
  }
  telInputObject(event){
    console.log(" tel obj event==",event)

  }
  onCountryChange(event){
    console.log("country==",event)
  }
}
