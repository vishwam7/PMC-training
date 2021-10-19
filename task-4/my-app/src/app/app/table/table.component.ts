import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {  FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { EmployeeService } from 'src/app/employee/employee.service';
import { employeeFetch } from '../employee-fetch';
import { employee } from './employees';


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  errorMessage:string='';
  employees:any; 

  constructor(library: FaIconLibrary,private _employeeService:EmployeeService,private router:Router) { 
    library.addIconPacks(fas);
   }


  ngOnInit(): void {
    
    // this.employees=JSON.stringify(data);
    // console.log(this.employees);

    this._employeeService.getEmployees().subscribe(employee=>{
      this.employees=employee.default;
    },
    error=>this.errorMessage=<any>error);
    
    
  }

  deleteRow(id:number){
    this._employeeService.deleteEmployee(id).subscribe(data=>{});
    this._employeeService.getEmployees().subscribe((response)=>{
      this.employees=response;
    })
  }

  update(id:number){
    this.router.navigate(['/update',id])    
  }
  add(id:number){
    this.router.navigate(['/add',id])    
  }
}
