import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mgaCurrency'
})
export class MgaCurrencyPipe implements PipeTransform {

   transform(
    value: number | null | undefined,
    currencyCode: string = 'MGA'
  ): string {
    if (value == null) return '';

    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currencyCode,
    }).format(value);
  }

}
