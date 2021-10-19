import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TableComponent } from './app/table/table.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpClientModule } from '@angular/common/http';
import { UpdateComponent } from './app/table/update/update.component';
import { EmployeeService } from './employee/employee.service';
import { AddComponent } from './app/table/add/add.component';
import { FormsModule } from '@angular/forms';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './app/in-memory-data-service';

@NgModule({
  declarations: [
    AppComponent,
    TableComponent,
    UpdateComponent,
    AddComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot([
      {path:'',component:TableComponent},
      {path:'update/:id',component:UpdateComponent},
      {path:'add/:id',component:AddComponent},
      {path:'assets/data/data.json/:id',component:EmployeeService}
    ]),
    NgbModule,
    FontAwesomeModule,
    HttpClientModule,
    FormsModule,
    HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService)
  ],
  providers: [
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
