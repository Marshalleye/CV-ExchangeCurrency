import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { Observable, range } from 'rxjs';
import { concatMap, map, scan } from 'rxjs/operators';

import { Api, Currency } from './api.model';

@Injectable({
  providedIn: 'root',
})
export class CurrencyExchangeService {
  api: Api = {
    urlNew: `https://bank.gov.ua/NBUStatService/v1/statdirectory/exchangenew?json`,
    urlCurrency: `https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange`,
  };

  startDate: string | any;
  endDate: string | any;
  dateDiff: number | any = null;
  currencySelectValue: string = 'select currency';

  chart: any;
  finalDate: any = [];

  fetch$: any;
  range$: any;
  constructor(private http: HttpClient) {}

  fetchStartVal(): Observable<Currency[]> {
    return this.http.get<Currency[]>(this.api.urlNew);
  }

  fetchData(num: number): Observable<Currency[]> {
    return this.http.get<Currency[]>(
      `${this.api.urlCurrency}?valcode=USD&date=${String(
        +this.startDate + num
      )}&json`
    );
  }

  fetchStream(): Observable<Currency[]> {
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
        }
      );
  }
  startDateValueChange({ value }: any): void {
    let day = value.getDate();
    let month = value.getMonth();
    let year = value.getFullYear();
    this.startDate = `${year}${month < 10 ? `0${month + 1}` : month + 1}${
      day < 10 ? `0${day}` : day
    }`;
  }
  endDateValueChange({ value }: any): void {
    let day = value.getDate();
    let month = value.getMonth();
    let year = value.getFullYear();
    this.endDate = `${year}${month < 10 ? `0${month + 1}` : month + 1}${
      day < 10 ? `0${day}` : day
    }`;
    this.getDiffDate(this.startDate, this.endDate);
  }

  getDiffDate(startDate: number, endDate: number): void {
    this.dateDiff = endDate - startDate;
  }

  setCurrencyVal({ value }: MatSelectChange): void {
    this.currencySelectValue = value;
  }

  setChart() {
    this.range$ = range(0, ++this.dateDiff);
    this.fetchStream();
  }

  setTable() {
    this.range$ = range(0, ++this.dateDiff);
    this.fetchStream();
  }
  getChart() {
    const xAxisData: any = [];
    const data1: any = [];
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
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: `UAH to ${this.currencySelectValue}`,
          type: 'line',
          data: data1,
          animationDelay: (idx: any) => idx * 50,
        },
      ],
      animationEasing: 'elasticOut',
      animationDelayUpdate: (idx: any) => idx * 50,
    };
  }
}
