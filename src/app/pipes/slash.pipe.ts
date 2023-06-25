import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'slash'
})
export class SlashPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string {
    return value.replace('-', '/');
  }

}
