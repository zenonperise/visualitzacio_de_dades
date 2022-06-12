import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'duration'
})
export class DurationPipe implements PipeTransform {

  conversionTable = [
    {label: 's', conversion: 60},
    {label: 'm', conversion: 60},
    {label: 'h', conversion: 8},
    {label: 'd', conversion: undefined}
  ]

  transform(value: unknown, ...args: unknown[]): unknown {
    if (value == undefined || value == null) {
      return null;
    }
    if (typeof value == 'number') {
      if (value == -1) {
        return null
      }
      var roundedValue = Math.round(value)
      var res:number[] = []
      this.conversionTable.forEach(conv => {
        if (!!conv.conversion) {
          res = [...res, roundedValue % conv.conversion]
          roundedValue = Math.round(roundedValue / conv.conversion)
        }
      })
      res = [...res, roundedValue]
      const combinedRes = res.map((value, index) => value == 0? undefined: value + this.conversionTable[index].label)
        .filter(value => value != undefined)
        .reverse()
      if (combinedRes.length == 0) {
        return '0'
      }
      return combinedRes.join(' ')
    }
    return null;
  }

}
