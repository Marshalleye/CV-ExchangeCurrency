import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { concatMap, map, scan } from 'rxjs/operators';

import { Api, BigCurrency, Currency } from './api.model';

@Injectable({
  providedIn: 'root',
})
export class CurrencyExchangeService {
  api: Api = {
    urlNew: `https://bank.gov.ua/NBUStatService/v1/statdirectory/exchangenew?json`,
    urlCurrency: `https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange`,
  };
  pickerStartDateValue: number;
  pickerEndDateValue: number;
  startDate: string;
  dateDiff: number = 0;
  currencySelectValue: string = 'select currency';
  chart: any;
  loader: boolean = false;

  finalDate: Array<Currency> = [];
  dateArr: Array<string> = [];

  range$: any;
  constructor(private http: HttpClient) {}

  fetchStartVal(): Observable<BigCurrency[]> {
    return this.http.get<BigCurrency[]>(this.api.urlNew);
  }

  fetchData(num: number): Observable<Currency[]> {
    return this.http.get<Currency[]>(
      `${this.api.urlCurrency}?valcode=${this.currencySelectValue}&date=${this.dateArr[num]}&json`
    );
  }

  fetchStream(): Observable<Currency[]> {
    this.loader = true;

    return this.range$
      .pipe(
        concatMap((val: number) => {
          return this.fetchData(val);
        }),
        map((arr: Array<Currency>) =>
          arr.map((v: Currency) => ({
            rate: v.rate,
            exchangedate: v.exchangedate,
          }))
        ),
        scan((acc: Array<Currency>, v: Array<Currency>) => [...acc, ...v], [])
      )
      .subscribe(
        (data: Array<Currency>) => {
          this.finalDate = data;
        },
        (err: Error) => console.log(err),
        () => {
          this.getChart();
          this.loader = false;
        }
      );
  }

  startDateValueChange({ value }: any): void {
    this.pickerStartDateValue = value.getTime();
    this.startDate = this.formatDateToString(value);
    this.dateArr = [];
  }

  endDateValueChange({ value }: any): void {
    this.pickerEndDateValue = value.getTime();

    this.getDiffDate(this.pickerStartDateValue, this.pickerEndDateValue);
    this.getDateArrCount();
  }

  getDateArrCount(): void {
    let lastDay: number = parseInt(
      this.startDate.slice(this.startDate.length - 2, this.startDate.length)
    );
    let lastMonth: number = parseInt(
      this.startDate.slice(this.startDate.length - 4, this.startDate.length - 2)
    );
    let lastYear: number = parseInt(
      this.startDate.slice(this.startDate.length - 8, this.startDate.length - 4)
    );

    for (let index = 0; index < this.dateDiff; index++) {
      if (lastDay < this.monthMaxDateNumber(lastMonth) && lastMonth <= 12) {
        this.dateArr.push(
          `${lastYear}${lastMonth < 10 ? `0${lastMonth}` : lastMonth}${
            lastDay < 10 ? `0${lastDay}` : lastDay
          }`
        );
        lastDay++;
      }
      if (lastDay === this.monthMaxDateNumber(lastMonth) && lastMonth < 12) {
        this.dateArr.push(
          `${lastYear}${lastMonth < 10 ? `0${lastMonth}` : lastMonth}${
            lastDay < 10 ? `0${lastDay}` : lastDay
          }`
        );
        ++lastMonth;
        lastDay = 1;
      }
      if (lastDay === this.monthMaxDateNumber(lastMonth) && lastMonth === 12) {
        this.dateArr.push(
          `${lastYear}${lastMonth < 10 ? `0${lastMonth}` : lastMonth}${
            lastDay < 10 ? `0${lastDay}` : lastDay
          }`
        );
        ++lastYear;
        lastMonth = 1;
        lastDay = 1;
      }
    }
  }

  formatDateToString(date: Date): string {
    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();
    return `${year}${month < 10 ? `0${month + 1}` : month + 1}${
      day < 10 ? `0${day}` : day
    }`;
  }

  getDiffDate(startDate: number, endDate: number): void {
    this.dateDiff = (endDate - startDate) / (1000 * 60 * 60 * 24) + 1;
  }

  monthMaxDateNumber(x: number): number {
    return 28 + ((x + Math.floor(x / 8)) % 2) + (2 % x) + 2 * Math.floor(1 / x);
  }

  getChart() {
    const xAxisData: Array<string> = [];
    const data1: Array<number> = [];
    for (let char in { ...this.finalDate }) {
      data1.push({ ...this.finalDate }[char].rate);
      xAxisData.push({ ...this.finalDate }[char].exchangedate);
    }

    this.chart = {
      legend: {
        data: [`UAH to ${this.currencySelectValue}`],
        align: 'left',
      },
      tooltip: {},
      xAxis: {
        data: xAxisData,
        silent: false,
        splitLine: {
          show: false,
        },
      },
      yAxis: [
        {
          type: 'value',
          min: function (value: any) {
            return value.min;
          },
          max: function (value: any) {
            return value.max;
          },
          axisLine: {
            show: true,
            symbol: 'pin',
          },
        },
      ],
      series: [
        {
          name: `UAH to ${this.currencySelectValue}`,
          type: 'line',
          data: data1,
          animationDelay: (idx: number) => idx * 50,
        },
      ],
      animationEasing: 'elasticOut',
      animationDelayUpdate: (idx: number) => idx * 50,
    };
  }
}
