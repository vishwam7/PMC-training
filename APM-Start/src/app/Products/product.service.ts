import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { IProduct } from "./products";
import { catchError, map, tap } from 'rxjs/operators';

@Injectable()
export class ProductService{

    private _productUrl='./api/products/products.json'
    constructor(private _http:HttpClient){}
    getProducts():Observable<IProduct[]>{
        return this._http.get<IProduct[]>(this._productUrl)
      .pipe(
        tap(data => console.log('All: ', JSON.stringify(data))),
        catchError(this.handleError)
      );
    }

    getProduct(id: number): Observable<IProduct | undefined> {
        return this.getProducts()
          .pipe(
            map((products: IProduct[]) => products.find(p => p.productId === id))
          );
      }
    

    private handleError(err:HttpErrorResponse){
        console.log(err.message);
        return Observable.throw(err.message);
    }
}