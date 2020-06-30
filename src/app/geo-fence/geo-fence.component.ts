import { Component, OnInit ,ViewChild } from '@angular/core';
import { ApiService } from '../api.service';
import { LoginCheckService } from '../login-check.service';
import { EditDeviceComponent } from '../edit-device/edit-device.component';
import { GeneralMaterialsService } from '../general-materials.service';
import {FormControl, FormBuilder,Validators,FormGroup} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Timestamp } from 'rxjs';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';

@Component({
  selector: 'app-geo-fence',
  templateUrl: './geo-fence.component.html',
  styleUrls: ['./geo-fence.component.css']
})
export class GeoFenceComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  deviceSelectForm:FormGroup
  loginData:any
  findData:any=[]
  coinData:any=[]
  coin:any=[]
  geofenceData:any=[]
  geoFenceStatus:boolean=false
  dataSource: any = [];
  displayedColumns = ['i','deviceName','coinId','coinName'];
  constructor(private fb: FormBuilder,private api: ApiService,private login:LoginCheckService,private general:GeneralMaterialsService) { }

  ngOnInit(): void {
    this.loginData = this.login.Getlogin()
    this.loginData = JSON.parse(this.loginData)
    this.refreshFinds()
    this.refreshCoins()
    // this.refreshGeoFence() 

    this.deviceSelectForm=this.fb.group({
      findSelect:['',Validators.required],
      coinSelect:['',Validators.required]
    })



  }

  refreshFinds(){
    var data={
      userId:this.loginData.userId,
      tblName:'deviceRegistration'
    }
  
    this.api.getData(data).then((res:any)=>{
      console.log("find device data ======",res);
      if(res.status){
        this.findData=res.success
   
      }
    })
  }
  
  refreshCoins(){
    var data={
      userId:this.loginData.userId,
      tblName:'coinRegistration'
    }
  
    this.api.getData(data).then((res:any)=>{
      console.log("coin data ======",res);
      if(res.status){
        this.coinData=res.success
  
      }
    })
  }
  
   
     
  
  refreshGeoFence(){
    var data={
      userId:this.loginData.userId
    }
    this.api.getGeofenceData(data).then((res:any)=>{
      console.log("Geo fence device get data ======",res);
      // if(res.status){
      //    for(let i=0;i<res.success.length;i++){
      //      this.geofenceData.push({
      //        i:i+1,
      //        deviceName:res.success[i].deviceName,
      //        coinId:res.success[i].coinId,
      //        coinName:res.success[i].coinName

      //      })
      //    }
      //    this.dataSource = new MatTableDataSource(this.geofenceData);
      //    setTimeout(() => {
      //      this.dataSource.sort = this.sort;
      //      this.dataSource.paginator = this.paginator;
      //     //  this.paginator.length = this.currentPageSize
      //    })
      // }
    })
  }



  submit(data){
    console.log("data====",data)

    
    var value=this.coinData.filter((element)=>{
      return data.coinSelect.includes(element.coinId)
    });
    
      if(value.length>0){
        this.coin=[]
        for(let i=0;i<value.length;i++){
          this.coin.push(value[i].coinName)
        }
       
    }
    var data1={
      userId:this.loginData.userId,
      deviceId:data.findSelect,
      coinId:data.coinSelect,
      coinName:this.coin

    }
     console.log("data1==",data1)
     this.api.setGeofenceData(data1).then((res:any)=>{
      console.log("Geo fence device set data ======",res);
      if(res.status){
        this.geoFenceStatus=true
        this.refreshGeoFence()
      }
  
    })
    
  
  }

 
}