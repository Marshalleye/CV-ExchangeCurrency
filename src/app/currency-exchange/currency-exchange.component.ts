import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { Observable, range } from 'rxjs';
import { BigCurrency } from './api.model';
import { CurrencyExchangeService } from './currency-exchange.service';

@Component({
  selector: 'app-currency-exchange',
  templateUrl: './currency-exchange.component.html',
  styleUrls: ['./currency-exchange.component.scss'],
})
export class CurrencyExchangeComponent implements OnInit {
  startApiDate: Observable<BigCurrency[]>;
  toggle: boolean;
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  constructor(public currencyService: CurrencyExchangeService) {}

  ngOnInit(): void {
    this.startApiDate = this.currencyService.fetchStartVal();
    this.currencyService.getChart();
  }

  setCurrencyVal({ value }: MatSelectChange): void {
    this.currencyService.currencySelectValue = value;
  }

  setChart() {
    this.currencyService.range$ = range(0, this.currencyService.dateDiff);
    this.currencyService.fetchStream();
  }

  setTable() {
    this.currencyService.range$ = range(0, this.currencyService.dateDiff);
    this.currencyService.fetchStream();
  }
}
