import { Observable } from 'rxjs';
import { employee } from '../app/table/employees';

export abstract class EmployeeServiceAbstract {
  employeesUrl = 'api/employees/';  // URL to web api

  abstract getEmployees (): Observable<any>;
  abstract getEmployee(id: number): Observable<any>;
//   abstract addEmployee (name: string): Observable<employee>;
  abstract deleteEmployee (employee: employee | number): Observable<employee>;
//   abstract updateEmployee (employee: employee): Observable<employee>;
}