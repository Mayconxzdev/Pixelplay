import { Pipe, PipeTransform, Inject, LOCALE_ID } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'dateFormat',
  standalone: true
})
export class DateFormatPipe implements PipeTransform {
  constructor(@Inject(LOCALE_ID) private locale: string) {}

  transform(value: string | Date | null | undefined, format: string = 'mediumDate'): string {
    if (!value) {
      return '';
    }

    try {
      const date = typeof value === 'string' ? new Date(value) : value;
      
      // Verifica se a data é válida
      if (isNaN(date.getTime())) {
        console.warn('Data inválida fornecida para o DateFormatPipe:', value);
        return '';
      }

      const datePipe = new DatePipe(this.locale);
      return datePipe.transform(date, format, undefined, this.locale) || '';
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return '';
    }
  }
}
