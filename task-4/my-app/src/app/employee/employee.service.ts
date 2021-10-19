import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { employee } from '../app/table/employees';
import { catchError, map, tap } from 'rxjs/operators';
import { employeeFetch } from '../app/employee-fetch';
import { ActivatedRoute } from '@angular/router';
import * as data from '../../assets/data/data.json'
import { EmployeeServiceAbstract } from './employee-service-abstract';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService extends EmployeeServiceAbstract {
  headers=new HttpHeaders().set('Content-Type','application/json').set('Accept','application/json');
  httpOptions={
    headers:this.headers
  }
  data:any;
  employee:any

  constructor(private _http:HttpClient,private activatedRoute:ActivatedRoute) {
    super();
  }

  

  ngOnInit () {
    this.activatedRoute.params.subscribe((params) => {
        if (params['id']) { this.getEmployee(params['id']); }        
    });
 }

 getEmployees():Observable<any>
  {
    return this._http.get<any>(this.employeesUrl)
  }

 getEmployee(id: number):Observable<any> 
  {
    // return data[id-1];
    return this._http.get(this.employeesUrl+id,this.httpOptions).pipe()
    
    // .pipe(map(employees=>employees.find(employee=>employee.id===id)))

    // return this.getEmployees()
    //   .pipe(
    //     map((products: any[]) => products.find(p => p.id === id))
    //   );
   
 }

 deleteEmployee(id:number):Observable<employee>
  {
    const url = `${this.employeesUrl}/${id}`;
    return this._http.delete<employee>(url,this.httpOptions);
  }

//  updateEmployee(employee:employeeFetch,id:number ):Observable<employee>
//   {
//     const url = `${this._employeeUrl}/${id}`;   
//     console.log(url);
//     console.log(employee);
//     return this._http.put<employee>(url,this.httpOptions).pipe(
//       map(()=>employee)
//       );
// }

  private handleError(err:HttpErrorResponse){
    console.log(err.message);
    return Observable.throw(err.message);
  }
}
