import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private totalSubject = new BehaviorSubject<number>(0);
  total$ = this.totalSubject.asObservable();

  addToCart(quantity: number) {
    this.totalSubject.next(this.totalSubject.value + quantity);
  }
}
