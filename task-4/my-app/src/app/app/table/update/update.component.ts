import { Component, OnInit } from '@angular/core';
import { DefaultValueAccessor, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { faUserEdit } from '@fortawesome/free-solid-svg-icons';
import { EmployeeService } from 'src/app/employee/employee.service';
import { employeeFetch } from '../../employee-fetch';
import { employee } from '../employees';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})
export class UpdateComponent implements OnInit {

  constructor(public route:ActivatedRoute,public router:Router,public _employeeService:EmployeeService) { }

  val:number=0
  employees:employee[]=[]
  employee:any;

  dname:string=''
  demail:string=''
  did:number=0
  dnumber:number=0

  ngOnInit(): void {
    let sub=this.route.params.subscribe(params=>{     
      this.val=params['id'];
    })

    this._employeeService.getEmployee(this.val).subscribe(data=>{
      console.log(data)
      this.employee=data.default
    })
    console.log(this.employee);
    
      this.dname=this.employee.name;
      this.demail=this.employee.email;
      this.dnumber=this.employee.number;
      this.did=this.employee.id;
  }

  onClickSubmit(data:any){
    // this._employeeService.updateEmployee(data,this.employee.id).subscribe(data=>{})
    
    this.router.navigate([''])
  }

}
